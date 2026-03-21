import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AMLModule = buildModule("AMLModule", (m) => {
    // This tells Ignition to deploy the "CrossBorderAML" contract
    const amlContract = m.contract("CrossBorderAML");

    return { amlContract };
});

export default AMLModule;