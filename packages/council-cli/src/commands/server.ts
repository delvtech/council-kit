import { command } from "clide-js";
import { execSync } from "node:child_process";
import signale from "signale";
import { parseEther } from "viem";
import { config } from "../config.js";
import { ConfiguredChain, configuredChains } from "../lib/viem.js";

const DEFAULT_RPC_URL = new URL(
  config.get("rpcUrl") || configuredChains.hardhat.rpcUrls.default.http[0],
);

// This command is only available if the optional hardhat peer dependency is
// installed so we import it dynamically to avoid crashing if it's not
// installed.
let error: Error | undefined;
const hardhat = await import("hardhat").catch((e) => {
  error = e;
  return undefined;
});

export default command({
  description: "Start a local ethereum node with hardhat.",
  isMiddleware: false,

  options: {
    H: {
      alias: ["hostname"],
      description: "The hostname to use.",
      type: "string",
      default: DEFAULT_RPC_URL.hostname,
    },
    f: {
      alias: ["fork"],
      description:
        "Whether to fork a network. If this is true and no fork-url is provided, the default from config will be used.",
      type: "boolean",
    },
    F: {
      alias: ["fork-url"],
      description:
        "A URL to fork from. Note: this is only used if `fork` is true.",
      type: "string",
      default: config.get("forkUrl"),
    },
    b: {
      alias: ["block"],
      description:
        "The fork block number to start at. Note: this is only used if `fork` is true.",
      type: "number",
    },
    p: {
      alias: ["port"],
      description: "The port to listen on.",
      type: "number",
      default: +DEFAULT_RPC_URL.port,
    },
    B: {
      alias: ["balance"],
      description:
        "The ETH balance to assign to each account as a decimal string.",
      type: "string",
      default: "1000",
    },
    t: {
      alias: ["block-time"],
      description: "The blockTime in seconds for automatic mining.",
      type: "number",
    },
    c: {
      alias: ["chain-id"],
      description:
        "The id to use for the local blockchain. Defaults to the id of either `chain` or `forkChain` depending on the value of `fork`.",
      type: "number",
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

    const balance = await options.balance();
    const blockTime = await options.blockTime();
    const block = await options.block();
    const hostname = await options.hostname();
    const port = await options.port();

    const fork = await options.fork();
    const forkUrl = await options.forkUrl(
      !fork
        ? undefined // Don't prompt if not forking
        : {
            prompt: "Enter the URL to fork from",
            validate: (url) => {
              try {
                new URL(url as string);
                return true;
              } catch {
                return "Invalid URL";
              }
            },
          },
    );

    let chainId = await options.chainId();
    if (chainId === undefined) {
      const chainName = config.get(fork ? "forkChain" : "chain")?.toLowerCase();
      chainId =
        chainName && chainName in configuredChains
          ? configuredChains[chainName as ConfiguredChain].id
          : configuredChains.hardhat.id;
    }

    const networks = hre.config.networks;
    networks.hardhat = {
      ...networks.hardhat,
      allowUnlimitedContractSize: true,
      accounts: {
        ...networks.hardhat.accounts,
        accountsBalance: String(parseEther(balance)),
      },
      chainId,
      forking:
        fork && forkUrl
          ? {
              url: forkUrl,
              enabled: true,
              blockNumber: block,
            }
          : undefined,
      mining:
        blockTime !== undefined
          ? {
              ...networks.hardhat.mining,
              auto: false,
              interval: blockTime * 1_000,
            }
          : networks.hardhat.mining,
    };

    hre.run("node", {
      hostname,
      port,
    });

    end();
  },
});
