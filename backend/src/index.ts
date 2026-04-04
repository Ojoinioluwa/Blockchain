import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import amlRoutes from "./routes/amlRoutes.js";

dotenv.config();

const app = express();

// Standard Middleware
app.use(cors());
app.use(express.json());

/**
 * MongoDB Connection Logic
 * Connects to the database using the MONGO_URI from .env
 */
const connectDB = async () => {
    try {
        const connString = process.env.MONGODB_URI || "mongodb://localhost:27017/sentinel_aml";
        await mongoose.connect(connString);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1); // Exit process with failure
    }
};

/**
 * Health Check Route
 * Useful for monitoring system uptime and DB status
 */
app.get("/api/health", (req, res) => {
    res.json({
        status: "AML Gateway is active",
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        timestamp: new Date().toISOString(),
        version: "1.0.0-PRO"
    });
});

/**
 * AML Compliance Routes
 * This includes:
 * - POST /api/aml/register (KYC & Whitelisting)
 * - POST /api/aml/transfer (Velocity Monitoring & Transfers)
 * - GET  /api/aml/reports  (Auditor's view of the log folder)
 */
app.use("/api/aml", amlRoutes);

/**
 * Global Error Handler
 * Ensures the backend doesn't crash on blockchain reverts or DB errors
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[Global Error]:", err.stack, err.message);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

const PORT = process.env.PORT || 3001;

// Initialize Database then Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("=================================================");
        console.log(`🛡️  SENTINEL AML GATEWAY RUNNING`);
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`📂 Audit Strategy: MongoDB + Local Logs`);
        console.log("=================================================");
    });
});