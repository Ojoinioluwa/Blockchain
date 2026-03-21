import { ethers } from "ethers";
import dotenv from "dotenv";
import { AML_ABI } from "./constants/abi.js";

dotenv.config();

// Initialize Provider (Reading from Blockchain)
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Initialize Signer (Writing to Blockchain/Paying Gas)
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY!, provider);

// Export the Contract Instance
export const amlContract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    AML_ABI,
    wallet
);

console.log("Connected to Sepolia AML Contract at:", process.env.CONTRACT_ADDRESS);