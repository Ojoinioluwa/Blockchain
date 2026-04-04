import mongoose, { Document } from "mongoose";
// --- DATABASE MODELS ---


// interface ISanction extends Document {
//     countryCode: string; // ISO Code e.g., 'KP', 'IR'
//     country: string;
//     restriction: string;
//     riskLevel: "HIGH" | "CRITICAL";
// }


const SanctionSchema = new mongoose.Schema({
    country: { type: String, required: true, },
    restriction: { type: String, required: true, },
    riskLevel: { type: String, enum: ["HIGH", "CRITICAL"], default: "CRITICAL" }
});

const Sanction = mongoose.model("Sanction", SanctionSchema);

export default Sanction