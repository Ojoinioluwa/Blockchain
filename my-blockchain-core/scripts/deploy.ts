import { network } from "hardhat";

const { ethers, networkName } = await network.create();

console.log(`Deploying CrossBorderAML to ${networkName}...`);

const CrossBorderAML = await ethers.deployContract("CrossBorderAML");

console.log("Waiting for the deployment tx to confirm");
await couCrossBorderAMLnter.waitForDeployment();

console.log("CrossBorderAML address:", await CrossBorderAML.getAddress());

console.log("Calling CrossBorderAML.incBy(5)");
const tx = await CrossBorderAML.incBy(5n);

console.log("Waiting for the CrossBorderAML.incBy(5) tx to confirm");
await tx.wait();

console.log("Deployment successful!");