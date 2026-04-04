
import mongoose, { Document } from "mongoose";



interface IAuditLog extends Document {
    timestamp: Date;
    event: string;
    level: 'INFO' | 'WARNING' | 'CRITICAL';
    sender: string;
    receiver: string;
    amount: string;
    reason: string | null;
    metadata: any;
}

const AuditLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    event: { type: String, required: true, index: true },
    level: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL'], required: true },
    sender: { type: String, lowercase: true, index: true },
    receiver: { type: String, lowercase: true, index: true },
    amount: { type: String, default: "0.00" },
    reason: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed } // Stores any extra data spread from ...data
}, { timestamps: true });

const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);



export default AuditLog