import { Request, Response } from "express";
import { amlContract } from "../blockchain.js";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// --- AUDIT CONFIGURATION ---
const AUDIT_LOG_DIR = "./audit_logs";
if (!fs.existsSync(AUDIT_LOG_DIR)) fs.mkdirSync(AUDIT_LOG_DIR);

/**
 * Internal helper to write an Audit Entry (The "Paper Trail")
 * Standardized to ensure the Dashboard UI always finds the correct fields
 */
const logAuditTrail = (event: string, data: any, level: "INFO" | "WARNING" | "CRITICAL") => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        level,
        // UI Mappings: Ensure these exist for the Dashboard cards
        sender: data.from || data.sender || data.userAddress || data.fromAddress || "SYSTEM_PROTOCOL",
        receiver: data.to || data.receiver || data.target || data.toAddress || "NETWORK_VAULT",
        amount: data.value || data.amount || "0.00",
        txHash: data.txHash || data.hash || null,
        reason: data.reason || (data.reasons ? data.reasons.join(" | ") : null),
        ...data
    };
    const fileName = `${level}_${Date.now()}_${Math.floor(Math.random() * 1000)}.json`;
    try {
        fs.writeFileSync(path.join(AUDIT_LOG_DIR, fileName), JSON.stringify(logEntry, null, 2));
        console.log(`[Audit] ${level} log generated: ${fileName}`);
    } catch (err) {
        console.error("Failed to write audit log:", err);
    }
};

// --- MOCK DATA STORES ---
const SANCTIONED_COUNTRIES = ["North Korea", "Iran", "Syria"];
const PEP_LIST = ["John Doe", "Alice Smith"];
const BLACKLISTED_WALLETS = [
    "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae".toLowerCase()
];

// --- VELOCITY ENGINE STATE ---
interface UserActivity {
    totalVolume24h: number;
    transactionCount24h: number;
    lastTimestamp: number;
}
const userActivityStore: Record<string, UserActivity> = {};

/**
 * 1. Process Registration (KYC + Sanctions + PEP)
 */
export const registerUser = async (req: Request, res: Response) => {
    const { userAddress, fullName, country } = req.body;

    try {
        let riskScore = 0;
        let reasons: string[] = [];

        // A. Sanctions Check
        if (SANCTIONED_COUNTRIES.includes(country)) {
            logAuditTrail("SANCTIONS_BLOCK", { fullName, country, userAddress, reason: "Jurisdiction is under international sanctions." }, "CRITICAL");
            return res.status(403).json({
                status: "REJECTED",
                reason: "Jurisdiction is under international sanctions."
            });
        }

        // B. PEP Check (Politically Exposed Person)
        if (PEP_LIST.includes(fullName)) {
            riskScore += 50;
            reasons.push("User identified as a PEP (Enhanced Due Diligence required)");
        }

        // C. Jurisdictional Risk
        if (country === "Russia" || country === "Venezuela") {
            riskScore += 30;
            reasons.push("High-risk jurisdiction assigned");
        }

        // D. Decision Logic
        if (riskScore >= 70) {
            logAuditTrail("REGISTRATION_PENDING", { fullName, userAddress, riskScore, reasons, country }, "WARNING");
            return res.status(422).json({
                status: "PENDING_REVIEW",
                riskScore,
                reasons
            });
        }

        // AUDIT: Log onboarding attempt
        logAuditTrail("USER_ONBOARDING_APPROVED", {
            fullName,
            userAddress,
            country,
            riskScore,
            reason: reasons.length > 0 ? reasons.join(" | ") : "Clear KYC/Sanctions check"
        }, "INFO");

        // Blockchain Execution: Update Whitelist
        // Note: Using updateComplianceStatus as per your request
        const tx = await amlContract.updateComplianceStatus!(userAddress, true);
        await tx.wait();

        res.json({
            status: "SUCCESS",
            message: "User verified and whitelisted on-chain",
            txHash: tx.hash,
            riskScore
        });

    } catch (error: any) {
        logAuditTrail("ONBOARDING_FAILURE", { userAddress, error: error.message }, "CRITICAL");
        res.status(500).json({ error: error.message });
    }
};

/**
 * 2. Initiate Transfer with Velocity Monitoring (Smurfing/Structuring Detection)
 */
export const initiateTransferWithMonitoring = async (req: Request, res: Response) => {
    const { fromAddress, toAddress, amountInEth } = req.body;
    const amount = parseFloat(amountInEth);

    try {
        let alertTriggered = false;
        let alertReasons: string[] = [];

        // A. Velocity Engine Logic (Smurfing/Structuring)
        const now = Date.now();
        if (!userActivityStore[fromAddress]) {
            userActivityStore[fromAddress] = { totalVolume24h: 0, transactionCount24h: 0, lastTimestamp: now };
        }

        const activity = userActivityStore[fromAddress]!;

        // Reset tracking if 24 hours have passed
        if (now - activity.lastTimestamp > 24 * 60 * 60 * 1000) {
            activity.totalVolume24h = 0;
            activity.transactionCount24h = 0;
            activity.lastTimestamp = now;
        }

        activity.totalVolume24h += amount;
        activity.transactionCount24h += 1;

        // B. Detection Logic: Structuring (Smurfing)
        if (activity.transactionCount24h > 3 && activity.totalVolume24h > 0.0005) {
            alertTriggered = true;
            alertReasons.push("High Velocity: Potential Structuring (Smurfing) detected.");
        }

        // C. Detection Logic: Large Threshold (Whale Movement)
        if (amount >= 0.001) {
            alertTriggered = true;
            alertReasons.push("High Value: Transaction exceeds risk threshold (0.001 ETH).");
        }

        // D. Blacklist Check
        if (BLACKLISTED_WALLETS.includes(toAddress.toLowerCase())) {
            logAuditTrail("TRANSFER_BLOCKED", { fromAddress, toAddress, reason: "Blacklisted Destination", amount: amountInEth }, "CRITICAL");
            return res.status(403).json({ error: "Transfer Blocked: Destination address is blacklisted." });
        }

        const combinedReason = alertReasons.join(" | ");

        // E. Audit Warning for SAR (Suspicious Activity Report)
        if (alertTriggered) {
            logAuditTrail("SAR_GENERATED", {
                sender: fromAddress,
                receiver: toAddress,
                amount: amountInEth,
                reason: combinedReason,
                stats: { count: activity.transactionCount24h, total: activity.totalVolume24h }
            }, "WARNING");
        }

        // F. Blockchain Execution
        const weiValue = ethers.parseEther(amountInEth.toString());
        const tx = await amlContract.initiateTransfer!(toAddress, weiValue);
        const receipt = await tx.wait();

        // G. Log Final Settlement
        logAuditTrail("TRANSACTION_SETTLED", {
            txHash: receipt.hash,
            from: fromAddress,
            to: toAddress,
            amount: amountInEth.toString()
        }, "INFO");

        res.json({
            status: "PROCESSED",
            txHash: receipt.hash,
            amlAlert: alertTriggered ? combinedReason : "None",
            volume24h: activity.totalVolume24h,
            count24h: activity.transactionCount24h
        });

    } catch (error: any) {
        logAuditTrail("TRANSACTION_FAILED", { fromAddress, toAddress, reason: error.message, amount: amountInEth }, "CRITICAL");
        res.status(400).json({
            error: "Blockchain rejected transfer. Check if wallets are whitelisted or if you have enough funds."
        });
    }
};

/**
 * 3. Fetch Audit Reports (Auditor View)
 */
export const getAuditReports = (req: Request, res: Response) => {
    try {
        const files = fs.readdirSync(AUDIT_LOG_DIR);
        const logs = files
            .filter(f => f.endsWith(".json"))
            .map(file => {
                const content = fs.readFileSync(path.join(AUDIT_LOG_DIR, file), "utf-8");
                return JSON.parse(content);
            });

        // Sort by most recent
        res.json(logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error: any) {
        res.status(500).json({ error: "Failed to retrieve audit logs" });
    }
};