import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    localhost: { 
      url: "http://127.0.0.1:8545" 
    },
    amoy: {
      url: process.env.ALCHEMY_AMOY_URL || "https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 80002
    },
    polygon: {
      url: process.env.ALCHEMY_POLYGON_URL || "https://polygon-mainnet.g.alchemy.com/v2/YOUR-API-KEY",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 137
    }
  }
};

export default config;