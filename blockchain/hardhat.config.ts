import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";



export default defineConfig({
  // This plugin bundles Ethers, Mocha, and TypeChain for Hardhat 3
  plugins: [hardhatToolboxMochaEthersPlugin],

  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },

  networks: {
    // 1. LOCAL: Used for your "Internal Bank" testing and AML simulations
    // This replaces the old "hardhat" network.
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
      chainId: 31337,
    },

    // 2. LOCALHOST: Use this when you run 'npx hardhat node'
    // Essential for connecting your React (Vite) frontend to a local chain.
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      chainType: "l1",
    },

    // 3. REMOTE: For your cross-border demonstration on a real testnet
    sepolia: {
      type: "http",
      chainType: "l1",
      // Hardhat 3 will look for these in your system environment or keystore
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },

  // FIXED: The verification config belongs here, NOT inside networks
  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },

  // Configuration for automatic Type Generation (crucial for TypeScript)
  typechain: {
    outDir: "typechain-types",
    // target: "ethers-v6",
  },
});