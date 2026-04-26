
import mongoose from "mongoose";



// interface IBlacklist extends Document {
//     address: string;
//     reason: string;
//     addedAt: Date;
// }

// interface ISanction extends Document {
//     countryCode: string;
//     countryName: string;
//     riskLevel: "HIGH" | "CRITICAL";
// }

// interface IUser extends Document {
//     address: string;
//     fullName: string;
//     country: string;
//     riskScore: number;
//     isWhitelisted: boolean;
//     registeredAt: Date;
// }

// interface ITransaction extends Document {
//     txHash: string;
//     from: string;
//     to: string;
//     amount: string;
//     status: "SUCCESS" | "FAILED" | "FLAGGED";
//     timestamp: Date;
// }



// ---------------------------------------------------------
// 1. USER / KYC MODEL
// Stores identity data and compliance status
// ---------------------------------------------------------
const UserSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    // idNumber: { type: String },
    isWhitelisted: { type: Boolean },
    kycStatus: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
        default: 'PENDING'
    },
    riskScore: { type: Number, default: 0 }, // 0-100 scale
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now }
});



const User = mongoose.model('User', UserSchema);

export default User