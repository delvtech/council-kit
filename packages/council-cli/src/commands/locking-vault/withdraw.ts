import { parseFixed } from "@delvtech/fixed-point-wasm";
import { command } from "clide-js";
import signale from "signale";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";

export default command({
  description: "Withdraw tokens from a LockingVault.",

  options: {
    a: {
      alias: ["address"],
      description: "The LockingVault contract address.",
      type: "string",
      customType: "hex",
      required: true,
    },
    A: {
      alias: ["amount"],
      description: "The amount of tokens to withdraw as a decimal string.",
      type: "string",
      required: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, client, next }) => {
    const { council, publicClient } = await getWriteOptions(options, client);

    const address = await options.address({
      prompt: "Enter Locking Vault address",
    });

    const amount = await options.amount({
      prompt: {
        message: "Enter deposit amount",
        initial: "0.0",
      },
    });

    const lockingVault = council.lockingVault(address);
    const token = await lockingVault.getToken();
    const decimals = await token.getDecimals();

    const hash = await lockingVault.withdraw({
      args: {
        amount: parseFixed(amount, decimals).bigint,
      },
      options: {
        onMined: () => {
          signale.success(`Transaction success: ${hash}`);
        },
      },
    });

    signale.pending(`Transaction submitted: ${hash}`);
    await publicClient.waitForTransactionReceipt({ hash });
    next(hash);
  },
});
