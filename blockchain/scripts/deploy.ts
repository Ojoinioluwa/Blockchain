import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
    // We use ethers from 'hardhat' because it is pre-configured with 
    // your compiled 'CrossBorderAML' artifacts and your network providers.
    console.log("Initializing deployment...");

    if (!ethers) {
        throw new Error("Ethers plugin not loaded properly from Hardhat.");
    }

    // getContractFactory is a Hardhat-specific helper
    const factory = await ethers.getContractFactory("CrossBorderAML");

    console.log("Deploying CrossBorderAML...");
    const contract = await factory.deploy();

    // Wait for the transaction to be mined
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`Success! Contract deployed to: ${address}`);
}

main().catch((error) => {
    console.error("Error during deployment:");
    console.error(error);
    process.exitCode = 1;
});