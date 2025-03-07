import { parseFixed } from "@delvtech/fixed-point-wasm";
import { command } from "clide-js";
import signale from "signale";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";

export default command({
  description: "Deposit tokens into a LockingVault.",

  options: {
    a: {
      alias: ["address"],
      describe: "The LockingVault contract address.",
      type: "hex",
      required: true,
    },
    A: {
      alias: ["amount"],
      describe: "The amount of tokens to deposit as a decimal string.",
      type: "string",
      required: true,
    },
    c: {
      alias: ["account"],
      describe: "The account to credit the deposit to.",
      type: "hex",
    },
    ...writeOptions,
  },

  handler: async ({ options, client, next }) => {
    const { council } = await getWriteOptions(options, client);

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

    const lockingVault = council.lockingVault(address);
    const token = await lockingVault.getToken();
    const decimals = await token.getDecimals();

    const hash = await lockingVault.deposit({
      args: {
        amount: parseFixed(amount, decimals).bigint,
        account,
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
