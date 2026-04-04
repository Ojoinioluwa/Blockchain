
import mongoose from "mongoose";

// ---------------------------------------------------------
// 2. TRANSACTION MODEL
// Tracks fund movements and AML analysis results
// ---------------------------------------------------------
const TransactionSchema = new mongoose.Schema({
    txHash: { type: String, unique: true, sparse: true },
    fromAddress: { type: String, required: true, lowercase: true, index: true },
    toAddress: { type: String, required: true, lowercase: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'ETH' },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSED', 'FLAGGED', 'BLOCKED'],
        default: 'PENDING'
    },
    amlAlert: { type: String, default: 'None' }, // e.g., "High Volume", "Structuring"
    metadata: {
        gasUsed: String,
        blockNumber: Number
    },
    timestamp: { type: Date, default: Date.now }
});



const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction