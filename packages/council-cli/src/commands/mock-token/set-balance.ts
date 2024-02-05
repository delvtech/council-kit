import { ViemReadWriteMockToken } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/write-options.js";

export default command({
  description: "Set an account's token balance",

  options: {
    a: {
      alias: ["address"],
      description: "The token contract address",
      type: "string",
      required: true,
    },
    f: {
      alias: ["account"],
      description: "The account to set balance for",
      type: "string",
      required: true,
    },
    b: {
      alias: ["balance"],
      description: "The new balance (as a decimal string) for the account",
      type: "string",
      required: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, next }) => {
    const {
      account: singerAccount,
      chain,
      rpcUrl,
    } = await getWriteOptions(options);

    const address = await options.address({
      prompt: "Enter token contract address",
    });

    const account = await options.account({
      prompt: "Enter account to set balance for",
    });

    const balance = await options.balance({
      prompt: {
        message: "Enter new balance for account",
        initial: "0.0",
      },
    });

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ transport, chain });
    const walletClient = createWalletClient({
      transport,
      chain,
      account: singerAccount,
    });

    const token = new ViemReadWriteMockToken({
      address: address as `0x${string}`,
      publicClient,
      walletClient,
    });

    const decimals = await token.getDecimals();
    const hash = await token.setBalance({
      account: account as `0x${string}`,
      balance: parseUnits(balance, decimals),
    });

    signale.success(hash);
    next(hash);
  },
});
