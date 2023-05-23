// This adds ethers to the hre which has dev utilities for local testnet like 'getSigners()'
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "dotenv/config";
// This adds support for typescript paths mappings
import "tsconfig-paths/register";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "goerli",
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
    mainnet: {
      chainId: 1,
      url: process.env.MAINNET_URI,
      accounts: [process.env.MAINNET_DEPLOYER_PRIVATE_KEY || ""],
    },
    goerli: {
      chainId: 5,
      url: process.env.GOERLI_URI,
      accounts: [process.env.GOERLI_DEPLOYER_PRIVATE_KEY || ""],
    },
    mumbai: {
      chainId: 80001,
      url: process.env.MUMBAI_URI,
      accounts: [process.env.GOERLI_DEPLOYER_PRIVATE_KEY || ""],
    },
    localhost: {
      chainId: 31337,
    },
  },
  // See: https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY as string,
      goerli: process.env.ETHERSCAN_API_KEY as string,
      polygonMumbai: process.env.POLYSCAN_API_KEY as string,
    },
  },
};

export default config;
