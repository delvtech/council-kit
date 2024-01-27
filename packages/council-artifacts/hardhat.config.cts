import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  paths: {
    sources: "contracts",
  },
  solidity: {
    compilers: [
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
};

export default config;
