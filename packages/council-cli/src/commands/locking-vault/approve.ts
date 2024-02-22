import { ReadWriteCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import {
  createPublicClient,
  createWalletClient,
  http,
  maxUint256,
  parseUnits,
} from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/writeOptions.js";

export default command({
  description:
    "Give a spending allowance to a LockingVault contract for the tokens it accepts.",

  options: {
    address: {
      describe: "The LockingVault contract address",
      type: "string",
      required: true,
    },
    amount: {
      describe: "The amount of tokens to approve",
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

    const amount = await options.amount();

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

    const hash = await token.approve({
      amount: amount !== undefined ? parseUnits(amount, decimals) : maxUint256,
      spender: lockingVault.address,
    });

    signale.success(hash);
    next(hash);
  },
});
