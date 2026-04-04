import { Request, Response } from "express";
import { amlContract } from "../blockchain.js";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import Blacklist from "src/models/BlacklistSchema.js";
import Sanction from "src/models/SanctionedCountrySchema.js";
import User from "src/models/UserSchema.js";
import Transaction from "src/models/TransactionSchema.js";
import AuditLog from "src/models/AuditSchema.js";



const getPagination = (query: any) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, parseInt(query.limit) || 20); // Cap at 100 per request
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};




// --- AUDIT HELPER (Dual-Sync: Filesystem + Database) ---

const AUDIT_LOG_DIR = "./audit_logs";
if (!fs.existsSync(AUDIT_LOG_DIR)) fs.mkdirSync(AUDIT_LOG_DIR);

/**
 * Synchronized Audit Logging
 * Saves to both the /audit_logs/ directory and the MongoDB AuditLog collection
 */
const logAuditTrail = async (event: string, data: any, level: "INFO" | "WARNING" | "CRITICAL") => {
    const logEntry = {
        timestamp: new Date(),
        event,
        level,
        sender: data.from || data.sender || data.fromAddressUsed || "SYSTEM",
        receiver: data.to || data.toAddress || "NETWORK",
        amount: data.amount ? data.amount.toString() : "0.00",
        reason: data.reason || null,
        metadata: data // Keep full context in metadata
    };

    const fileName = `${level}_${Date.now()}.json`;

    try {
        // 1. Write to local file system
        fs.writeFileSync(
            path.join(AUDIT_LOG_DIR, fileName),
            JSON.stringify({ ...logEntry, timestamp: logEntry.timestamp.toISOString() }, null, 2)
        );

        // 2. Sync to Database
        await AuditLog.create(logEntry);

    } catch (err) {
        console.error("Audit log sync error:", err);
    }
};

// --- CONTROLLER LOGIC ---

/**
 * 1. Process Registration (DB-Driven KYC & Sanctions)
 */
export const registerUser = async (req: Request, res: Response) => {
    const { userAddress, fullName, country, email, idNumber } = req.body;
    console.log("Register triggered")

    try {
        const lowAddr = userAddress.toLowerCase();

        // A. DB Check: Is wallet blacklisted?
        const blacklisted = await Blacklist.findOne({ address: lowAddr });
        if (blacklisted) {
            logAuditTrail("REGISTRATION_REJECTED", { userAddress, reason: `Blacklisted: ${blacklisted.reason}` }, "CRITICAL");
            return res.status(403).json({
                status: "REJECTED",
                reason: "This wallet address is flagged in our global blacklist database."
            });
        }

        // B. DB Check: Is country sanctioned?
        const sanctioned = await Sanction.findOne({ countryName: country });
        if (sanctioned && sanctioned.riskLevel === "CRITICAL") {
            logAuditTrail("SANCTIONS_BLOCK", { fullName, country, userAddress, reason: "Prohibited jurisdiction" }, "CRITICAL");
            return res.status(403).json({
                status: "REJECTED",
                reason: `Registration from ${country} is prohibited under international sanctions.`
            });
        }

        let riskScore = 0;
        let reasons: string[] = [];

        // C. Jurisdictional Risk (DB High Risk, but not Critical)
        if (sanctioned && sanctioned.riskLevel === "HIGH") {
            riskScore += 40;
            reasons.push(`${country} is flagged as a high-risk jurisdiction.`);
        }

        // D. Decision & Blockchain Sync
        if (riskScore >= 70) {
            logAuditTrail("REGISTRATION_PENDING", { userAddress, riskScore, reasons }, "WARNING");
            return res.status(422).json({ status: "PENDING_REVIEW", riskScore, reasons });
        }

        // Finalize Whitelist on Chain
        const tx = await amlContract.updateComplianceStatus!(userAddress, true);
        await tx.wait();

        // E. PERSIST USER TO DATABASE
        await User.create(
            {
                fullName,
                walletAddress: lowAddr,
                // country,
                riskScore,
                email,
                idNumber,
                isWhitelisted: true,
                createdAt: new Date()
            },

        );

        logAuditTrail("USER_ONBOARDING_APPROVED", { userAddress, country, riskScore }, "INFO");

        console.log("Got to the end")

        res.json({ status: "SUCCESS", txHash: tx.hash, riskScore, });

    } catch (error: any) {
        logAuditTrail("ONBOARDING_FAILURE", { userAddress, error: error.message }, "CRITICAL");
        res.status(500).json({ error: error.message });
    }
};

/**
 * Enhanced Initiate Transfer with Static Blacklist & Dynamic Velocity Monitoring
 */
export const initiateTransferWithMonitoring = async (req: Request, res: Response) => {
    const { fromAddress, toAddress, amountInEth } = req.body;
    const DAILY_VELOCITY_LIMIT = 0.5; // The ETH threshold for automatic blocking within 24h

    let fromAddressUsed = fromAddress || process.env.CONTRACT_ADDRESS
    console.log(fromAddressUsed, toAddress, amountInEth)

    try {
        const lowFrom = fromAddressUsed.toLowerCase();
        const lowTo = toAddress.toLowerCase();
        const currentAmount = Number(amountInEth);

        // 1. STATIC CHECK: Blacklist Look-up
        const blacklistedMatch = await Blacklist.findOne({ address: { $in: [lowFrom, lowTo] } });
        if (blacklistedMatch) {
            const role = blacklistedMatch.walletAddress === lowFrom ? "Sender" : "Receiver";

            await Transaction.create({
                fromAddress: lowFrom,
                toAddress: lowTo,
                amount: currentAmount,
                status: 'BLOCKED',
                amlAlert: `Blacklisted Entity: ${role}`,
                timestamp: new Date()
            });

            logAuditTrail("TRANSFER_BLOCKED", { fromAddressUsed, toAddress, reason: `Static Block: ${role} blacklisted` }, "CRITICAL");
            return res.status(403).json({ error: `Security Block: The ${role} address is blacklisted.` });
        }

        // 2. DYNAMIC CHECK: Velocity Monitoring (Look-back 24 hours)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Aggregate total volume for this sender in the last 24h
        const recentActivity = await Transaction.aggregate([
            {
                $match: {
                    fromAddress: lowFrom,
                    status: 'PROCESSED',
                    timestamp: { $gte: twentyFourHoursAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    totalVolume: { $sum: "$amount" }
                }
            }
        ]);

        const previousVolume = recentActivity.length > 0 ? recentActivity[0].totalVolume : 0;
        const projectedTotal = previousVolume + currentAmount;

        if (projectedTotal > DAILY_VELOCITY_LIMIT) {
            // Record the VELOCITY block
            await Transaction.create({
                fromAddress: lowFrom,
                toAddress: lowTo,
                amount: currentAmount,
                status: 'BLOCKED',
                amlAlert: `Velocity Limit Exceeded: ${projectedTotal.toFixed(4)} ETH / 24h`,
                timestamp: new Date()
            });

            logAuditTrail("VELOCITY_BLOCK", {
                fromAddress,
                projectedTotal,
                limit: DAILY_VELOCITY_LIMIT,
                reason: "Potential Structuring/Smurfing Activity detected"
            }, "CRITICAL");

            return res.status(429).json({
                error: "Transaction Blocked",
                reason: `Daily transfer limit of ${DAILY_VELOCITY_LIMIT} ETH exceeded. High-frequency activity detected.`
            });
        }

        // 3. BLOCKCHAIN EXECUTION
        // Note: amlContract must be initialized with a signer in your middleware/init script
        const weiValue = ethers.parseEther(amountInEth.toString());
        const tx = await amlContract.initiateTransfer!(toAddress, weiValue);
        const receipt = await tx.wait();

        // 4. PERSIST SUCCESSFUL TRANSACTION
        await Transaction.create({
            txHash: receipt.hash,
            fromAddress: lowFrom,
            toAddress: lowTo,
            amount: currentAmount,
            currency: 'ETH',
            status: 'PROCESSED',
            amlAlert: 'None',
            metadata: {
                gasUsed: receipt.gasUsed.toString(),
                blockNumber: receipt.blockNumber,
                dailyVolumeSnapshot: projectedTotal // Useful for auditing later
            },
            timestamp: new Date()
        });

        logAuditTrail("TRANSACTION_SETTLED", {
            txHash: receipt.hash,
            fromAddress,
            toAddress,
            amount: amountInEth
        }, "INFO");

        res.json({
            status: "PROCESSED",
            txHash: receipt.hash,
            velocityCheck: "Pass"
        });

    } catch (error: any) {
        logAuditTrail("TRANSFER_FAILURE", { fromAddress, toAddress, error: error.message }, "CRITICAL");
        res.status(400).json({ error: error.message });
    }
};

/**
 * 3. Administrative: Update Lists (Blacklist/Sanction)
 */
export const addToBlacklist = async (req: Request, res: Response) => {
    const { walletAddress, reason, severity, addedBy } = req.body;
    try {
        const entry = await Blacklist.findOneAndUpdate(
            { walletAddress: walletAddress.toLowerCase() },
            {
                reason,
                severity: severity || 'HIGH',
                addedBy: addedBy || 'Admin',
                isActive: true
            },
            { upsert: true, new: true }
        );

        // Sync with Smart Contract compliance registry
        const tx = await amlContract.updateComplianceStatus!(walletAddress, false);
        await tx.wait();

        res.json({ status: "SUCCESS", entry });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};


export const removeFromBlacklist = async (req: Request, res: Response) => {
    const { walletAddress, removedBy } = req.body;

    if (!walletAddress) {
        return res.status(400).json({ error: "Id address is required." });
    }
    console.log(walletAddress)

    try {
        const lowAddr = walletAddress.toLowerCase();

        // 1. Update Database Status
        const entry = await Blacklist.findOneAndDelete({ walletAddress: lowAddr });

        if (!entry) {
            return res.status(404).json({ error: "Address not found in blacklist." });
        }

        // 2. Update Smart Contract Registry (Mark as compliant/true)
        // Note: Assuming your contract uses 'true' for allowed and 'false' for blocked
        const tx = await amlContract.updateComplianceStatus!(lowAddr, true);
        const receipt = await tx.wait();

        // 3. Log the Administrative Action
        logAuditTrail("BLACKLIST_REMOVAL", {
            walletAddress: lowAddr,
            removedBy: removedBy || "Admin",
            previousReason: entry.reason,
            txHash: receipt.hash
        }, "INFO");

        res.json({
            status: "SUCCESS",
            message: `Address ${lowAddr} has been reactivated.`,
            txHash: receipt.hash
        });

    } catch (error: any) {
        logAuditTrail("BLACKLIST_REMOVAL_FAILURE", {
            walletAddress,
            error: error.message
        }, "CRITICAL");

        res.status(500).json({
            error: "Failed to remove address from blacklist.",
            details: error.message
        });
    }
};

/**
 * List Users with Filtering
 * Query Params: country, kycLevel, isVerified, walletAddress
 */
export const listUsers = async (req: Request, res: Response) => {
    try {
        const { country, kycLevel, isVerified, walletAddress } = req.query;
        const { page, limit, skip } = getPagination(req.query);

        const filter: any = {};
        if (country) filter.country = country;
        if (kycLevel) filter.kycLevel = parseInt(kycLevel as string);
        if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
        if (walletAddress) filter.walletAddress = (walletAddress as string).toLowerCase();

        const [data, total] = await Promise.all([
            User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            User.countDocuments(filter)
        ]);

        res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

/**
 * List Blacklist with Filtering
 * Query Params: walletAddress, severity, isActive
 */
export const listBlacklist = async (req: Request, res: Response) => {
    try {
        const { walletAddress, severity, isActive } = req.query;
        const { page, limit, skip } = getPagination(req.query);

        const filter: any = {};
        if (walletAddress) filter.walletAddress = (walletAddress as string).toLowerCase();
        if (severity) filter.severity = severity;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const [data, total] = await Promise.all([
            Blacklist.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Blacklist.countDocuments(filter)
        ]);

        res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blacklist" });
    }
};

/**
 * List Sanctioned Countries with Filtering
 * Query Params: riskLevel, search (name or code)
 */
export const listSanctionedCountries = async (req: Request, res: Response) => {
    try {
        const { riskLevel, search } = req.query;
        const { page, limit, skip } = getPagination(req.query);

        const filter: any = {};
        if (riskLevel) filter.riskLevel = riskLevel;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: (search as string).toUpperCase() }
            ];
        }

        const [data, total] = await Promise.all([
            Sanction.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
            Sanction.countDocuments(filter)
        ]);

        res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sanctioned countries" });
    }
};



/**
 * List Transactions with Filtering & Pagination
 * Query Params: sender, receiver, level, event, startDate, endDate
 */
export const listAllTransactions = async (req: Request, res: Response) => {
    try {
        const { sender, receiver, level, event, startDate, endDate } = req.query;
        const { page, limit, skip } = getPagination(req.query);

        const filter: any = {};
        if (sender) filter.sender = (sender as string).toLowerCase();
        if (receiver) filter.receiver = (receiver as string).toLowerCase();
        if (level) filter.level = level;
        if (event) filter.event = event;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate as string);
            if (endDate) filter.timestamp.$lte = new Date(endDate as string);
        }

        const [data, total] = await Promise.all([
            AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
            AuditLog.countDocuments(filter)
        ]);

        res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
};


export const addSanctionedCountry = async (req: Request, res: Response) => {
    try {
        const { country, restriction, riskLevel } = req.body;

        if (!country || !restriction) {
            return res.status(400).json({ error: "Country name and restriction type are required" });
        }

        // Check for duplicates to prevent redundant database entries
        const existing = await Sanction.findOne({
            country
        });

        if (existing) {
            return res.status(409).json({ error: "Jurisdiction already exists in the registry" });
        }
        console.log("got here")

        const newSanction = await Sanction.create({
            country,
            restriction,
            riskLevel: riskLevel || (restriction === 'TOTAL_BLOCK' ? 'CRITICAL' : 'WARNING'),
            // addedAt: new Date()
        });



        res.status(201).json({
            message: "Sanctioned jurisdiction registered successfully",
            data: newSanction
        });
    } catch (error) {
        console.error("Add Sanction Error:", error);
        res.status(500).json({ error: "Failed to update protocol registry" });
    }
};

/**
 * removeSanctionedCountry - Lifts restrictions for a specific ID
 */
export const removeSanctionedCountry = async (req: Request, res: Response) => {
    try {
        // CHANGE THIS: Extract from params instead of body
        const { id } = req.params;
        // console.log(req.body)

        console.log("Removing ID:", id);

        const deleted = await Sanction.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Jurisdiction record not found" });
        }

        res.json({
            message: "Protocol sanctions lifted successfully",
            id
        });
    } catch (error) {
        console.error("Remove Sanction Error:", error);
        res.status(500).json({ error: "Failed to remove jurisdiction" });
    }
};

/**
 * Seed Function (Run once to initialize your DB)
 */
export const seedSecurityData = async () => {
    const sanctions = [
        { countryName: "North Korea", riskLevel: "CRITICAL" },
        { countryName: "Iran", riskLevel: "CRITICAL" },
        { countryName: "Russia", riskLevel: "HIGH" }
    ];
    await Sanction.deleteMany({});
    await Sanction.insertMany(sanctions);
    console.log("Security Seed: Sanctioned countries updated.");
};