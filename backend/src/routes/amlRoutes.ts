import { Router } from "express";
import {
    registerUser,
    initiateTransferWithMonitoring,
    addToBlacklist,
    removeFromBlacklist,
    listUsers,
    listBlacklist,
    listSanctionedCountries,
    listAllTransactions,
    seedSecurityData,
    removeSanctionedCountry,
    addSanctionedCountry
} from "../controllers/amlController.js";

const router = Router();

/**
 * @section User & Transaction Operations
 */

// Register a new user with KYC and Sanction checks
router.post("/register", registerUser);

// Execute a transfer with real-time AML monitoring
router.post("/transfer", initiateTransferWithMonitoring);


/**
 * @section Listing & Monitoring (High-Performance DB Queries)
 * All these routes support pagination (?page=1&limit=20) and dynamic filtering
 */

// List all audit logs/transactions with sender/receiver/date filters
router.get("/transactions", listAllTransactions);

// List all registered users with country/kycLevel filters
router.get("/users", listUsers);

// List the current blacklist with severity/status filters
router.get("/blacklist", listBlacklist);

// List sanctioned jurisdictions
router.get("/sanctions", listSanctionedCountries);

// remove specific country from the sanctioned list
router.post("/sanctions/remove/:id", removeSanctionedCountry);

// add specific country from the sanctioned list
router.post("/sanctions/add", addSanctionedCountry);


/**
 * @section Administrative Controls
 */

// Add a specific wallet address to the blacklist (Syncs with Smart Contract)
router.post("/blacklist/add", addToBlacklist);

// Remove/Deactivate a blacklist entry (Syncs with Smart Contract)
router.post("/blacklist/remove", removeFromBlacklist);

// Utility route to seed initial sanction data (e.g., North Korea, Iran)
router.post("/seed", async (req, res) => {
    try {
        await seedSecurityData();
        res.json({ message: "Security data seeded successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;