import { ViemReadWriteMockToken } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/write-options.js";

export default command({
  description: "Mint tokens",

  options: {
    a: {
      alias: ["address"],
      describe: "The token contract address",
      type: "string",
      required: true,
    },
    f: {
      alias: ["account"],
      describe: "The account to mint tokens for",
      type: "string",
      required: true,
    },
    t: {
      alias: ["amount"],
      describe: "The amount of tokens to mint",
      type: "string",
      required: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, next }) => {
    const {
      account: signerAccount,
      chain,
      rpcUrl,
    } = await getWriteOptions(options);

    const address = await options.address({
      prompt: "Enter token contract address",
    });

    const account = await options.account({
      prompt: "Enter account to mint tokens for",
    });

    const amount = await options.amount({
      prompt: {
        message: "Enter amount of tokens to mint",
        initial: "0.0",
      },
    });

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ transport, chain });
    const walletClient = createWalletClient({
      transport,
      chain,
      account: signerAccount,
    });

    const token = new ViemReadWriteMockToken({
      address: address as `0x${string}`,
      publicClient,
      walletClient,
    });

    const decimals = await token.getDecimals();
    const hash = await token.mint({
      account: account as `0x${string}`,
      amount: parseUnits(amount, decimals),
    });

    signale.success(hash);
    next(hash);
  },
});
