// This adds ethers to the hre which has dev utilities for local testnet like 'getSigners()'
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
// Typechain support for hardhat
import "@typechain/hardhat";
import "dotenv/config";
// This adds support for typescript paths mappings
import "tsconfig-paths/register";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "goerli",
  paths: {
    sources: "src",
  },
  solidity: {
    compilers: [
      {
        version: "0.7.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 7500,
          },
        },
      },
    ],
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_URI,
    },
  },
  // See: https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
