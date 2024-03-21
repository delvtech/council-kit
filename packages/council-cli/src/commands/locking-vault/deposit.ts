import { ReadWriteCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/writeOptions.js";

export default command({
  description: "Deposit tokens into a LockingVault.",

  options: {
    address: {
      describe: "The LockingVault contract address",
      type: "string",
      required: true,
    },
    amount: {
      describe: "The amount of tokens to deposit",
      type: "string",
      required: true,
    },
    account: {
      describe: "The account to credit the deposit to",
      type: "string",
    },
    ...writeOptions,
  },

  handler: async ({ options, context, next }) => {
    const {
      account: signerAccount,
      chain,
      rpcUrl,
    } = await getWriteOptions(options, context);

    const address = await options.address({
      prompt: "Enter Locking Vault address",
    });

    const amount = await options.amount({
      prompt: {
        message: "Enter deposit amount",
        initial: "0.0",
      },
    });

    const account = await options.account();

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ chain, transport });
    const walletClient = createWalletClient({
      transport,
      chain,
      account: signerAccount,
    });

    const lockingVault = new ReadWriteCouncil({
      publicClient,
      walletClient,
    }).lockingVault(address as `0x${string}`);

    const token = await lockingVault.getToken();
    const decimals = await token.getDecimals();

    const hash = await lockingVault.deposit({
      amount: parseUnits(amount, decimals),
      account: account as `0x${string}` | undefined,
    });

    signale.success(hash);
    next(hash);
  },
});
