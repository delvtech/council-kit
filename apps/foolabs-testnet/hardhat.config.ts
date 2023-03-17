import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
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
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "100000000000000000000000", // 100000 ETH
        count: 10,
      },
    },
  },
};

export default config;
