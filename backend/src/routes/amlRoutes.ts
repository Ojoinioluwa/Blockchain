import { Router } from "express";
import { registerUser, initiateTransferWithMonitoring, getAuditReports } from "../controllers/amlController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/transfer", initiateTransferWithMonitoring);
// router.get("/audit", getAuditLogs);
router.get("/reports", getAuditReports);
export default router;