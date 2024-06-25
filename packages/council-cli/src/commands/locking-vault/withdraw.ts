import { ReadWriteCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/writeOptions.js";

export default command({
  description: "Withdraw tokens from a LockingVault.",

  options: {
    address: {
      describe: "The LockingVault contract address",
      type: "string",
      required: true,
    },
    amount: {
      describe: "The amount of tokens to withdraw",
      type: "string",
      required: true,
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

    const hash = await lockingVault.withdraw({
      amount: parseUnits(amount, decimals),
    });

    signale.success(hash);
    next(hash);
  },
});
