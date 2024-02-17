import { command } from "clide-js";
import hre from "hardhat";
import { parseUnits } from "viem";

export default command({
  description: "Start a local ethereum node",
  isMiddleware: false,

  options: {
    host: {
      description: "The host to listen on",
      type: "string",
      default: "127.0.0.1",
    },
    port: {
      description: "The port to listen on",
      type: "number",
      default: 8545,
    },
    balance: {
      description: "The ETH balance to assign to each account",
      type: "number",
      default: 1_000,
    },
    "block-time": {
      description: "The blockTime in seconds for automatic mining",
      type: "number",
    },
    "chain-id": {
      description: "The id to use for the local blockchain",
      type: "number",
      default: 1337,
    },
  },

  handler: async ({ options, end }) => {
    const host = await options.host();
    const port = await options.port();
    const balance = await options.balance();
    const blockTime = await options.blockTime();
    const chainId = await options.chainId();

    hre.config.networks.hardhat = {
      ...hre.config.networks.hardhat,
      chainId,

      allowUnlimitedContractSize: true,
      accounts: {
        ...hre.config.networks.hardhat.accounts,
        accountsBalance: String(parseUnits(String(balance), 18)),
      },
      mining:
        blockTime !== undefined
          ? {
              ...hre.config.networks.hardhat.mining,
              auto: false,
              interval: blockTime * 1_000,
            }
          : hre.config.networks.hardhat.mining,
    };

    hre.run("node", {
      hostname: host,
      port,
    });

    end();
  },
});
