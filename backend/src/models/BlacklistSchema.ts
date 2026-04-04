
import mongoose from "mongoose";


// ---------------------------------------------------------
// 3. BLACKLIST MODEL
// The core engine for blocking sanctioned addresses
// ---------------------------------------------------------
const BlacklistSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    reason: { type: String, required: true }, // e.g., "Sanctioned Entity", "Fraud", "Theft"
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
    addedBy: { type: String, default: 'System-Auto' }, // Admin or automated flag
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});


const Blacklist = mongoose.model('Blacklist', BlacklistSchema);

export default Blacklist