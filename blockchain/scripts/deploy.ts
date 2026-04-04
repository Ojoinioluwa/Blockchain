import ethers from "hardhat";

async function main() {
    const CrossBorderAML = await ethers.getContractFactory("CrossBorderAML");
    const contract = await CrossBorderAML.deploy();

    await contract.waitForDeployment();

    console.log(`AML Contract deployed to: ${await contract.getAddress()}`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


