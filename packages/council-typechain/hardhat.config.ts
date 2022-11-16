import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  paths: {
    sources: "contracts",
  },
  solidity: {
    compilers: [
      // {
      //   version: "0.8.3",
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 10000,
      //       // runs: 7500,
      //     },
      //   },
      // },
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 7500,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: "src",
    target: "ethers-v5",
    alwaysGenerateOverloads: true,
    externalArtifacts: ["externalArtifacts/*.json"],
  },
};

export default config;
