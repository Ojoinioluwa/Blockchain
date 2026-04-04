// Match these to your Mongoose Schemas
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type KYCStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type TransactionStatus = 'PENDING' | 'PROCESSED' | 'FLAGGED' | 'BLOCKED';

export interface User {
    _id: string;
    walletAddress: string;
    fullName: string;
    email: string;
    idNumber: string;
    kycStatus: KYCStatus;
    riskScore: number;
    createdAt: string;
    lastActive: string;
}

export interface Transaction {
    _id: string;
    txHash?: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
    currency: string;
    status: TransactionStatus;
    amlAlert: string;
    metadata?: {
        gasUsed?: string;
        blockNumber?: number;
    };
    timestamp: string;
}

export interface BlacklistEntry {
    _id: string;
    walletAddress: string;
    reason: string;
    severity: RiskLevel;
    addedBy: string;
    isActive: boolean;
    createdAt: string;
}

export interface AuditLog {
    _id: string;
    timestamp: string;
    event: string;
    level: 'INFO' | 'WARNING' | 'CRITICAL';
    sender: string;
    receiver: string;
    amount: string;
    reason: string | null;
    metadata: any;
}