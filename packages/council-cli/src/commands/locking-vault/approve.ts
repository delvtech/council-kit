import { command } from "clide-js";
import signale from "signale";
import { maxUint256, parseUnits } from "viem";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";

export default command({
  description:
    "Give a spending allowance to a LockingVault contract for the tokens it accepts.",

  options: {
    a: {
      alias: ["address"],
      describe: "The LockingVault contract address.",
      type: "hex",
      required: true,
    },
    A: {
      alias: ["amount"],
      describe: "The amount of tokens to approve as a decimal string.",
      type: "string",
    },
    ...writeOptions,
  },

  handler: async ({ options, client, next }) => {
    const { council } = await getWriteOptions(options, client);

    const address = await options.address({
      prompt: "Enter Locking Vault address",
    });

    const amount = await options.amount();

    const lockingVault = council.lockingVault(address);
    const token = await lockingVault.getToken();
    const decimals = await token.getDecimals();

    const hash = await token.approve({
      args: {
        amount:
          amount !== undefined ? parseUnits(amount, decimals) : maxUint256,
        spender: lockingVault.address,
      },
      options: {
        onMined: () => {
          signale.success(`Transaction success: ${hash}`);
        },
      },
    });

    signale.pending(`Transaction submitted: ${hash}`);
    next(hash);
  },
});
