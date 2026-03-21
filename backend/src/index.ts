import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import amlRoutes from "./routes/amlRoutes.js";

dotenv.config();

const app = express();

// Standard Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/api/health", (req, res) => {
    res.json({ status: "AML Gateway is active", timestamp: new Date().toISOString() });
});

/**
 * AML Compliance Routes
 * This includes:
 * - POST /api/aml/register (KYC & Whitelisting)
 * - POST /api/aml/transfer (Velocity Monitoring & Transfers)
 * - GET  /api/aml/reports  (Audit Logs & SARs)
 */
app.use("/api/aml", amlRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("========================================");
    console.log(`Compliance Backend: http://localhost:${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log("========================================");
});