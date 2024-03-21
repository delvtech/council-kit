import { command } from "clide-js";
import { execSync } from "node:child_process";
import signale from "signale";
import { parseUnits } from "viem";

// This command is only available if the optional hardhat peer dependency is
// installed so we import it dynamically to avoid crashing if it's not
// installed.
let error: Error | undefined;
const hardhat = await import("hardhat").catch((e) => {
  error = e;
  return undefined;
});

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
    if (!hardhat) {
      // https://hardhat.org/hardhat-runner/docs/errors#HH1
      if (error?.message.startsWith("HH1")) {
        signale.error(
          "Must be inside a Hardhat project with a hardhat config file.",
        );
      } else if (error?.message.startsWith("HH")) {
        signale.error(error.message);
      } else {
        const globalNodeModules = execSync("npm root -g").toString().trim();
        const localNodeModules = execSync("npm root").toString().trim();
        const isGlobal = globalNodeModules === localNodeModules;

        signale.error(error?.message ?? error);
        signale.error(
          `This command requires hardhat to be installed. Run ${
            isGlobal
              ? "`npm install -g hardhat`"
              : "`npm install --save-dev hardhat`"
          } to install hardhat.`,
        );
      }

      return end();
    }

    const hre = hardhat.default;

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
