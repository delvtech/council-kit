import { MockERC20 } from "@delvtech/council-artifacts/MockERC20";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";

export default command({
  description: "Set an account's token balance",

  options: {
    a: {
      alias: ["address"],
      description: "The token contract address.",
      type: "string",
      customType: "hex",
      required: true,
    },
    c: {
      alias: ["account"],
      description: "The account to set balance for.",
      type: "string",
      customType: "hex",
      required: true,
    },
    b: {
      alias: ["balance"],
      description:
        "The new balance (as a decimal string) for the account as a decimal string.",
      type: "string",
      required: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, client, next }) => {
    const { drift } = await getWriteOptions(options, client);

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

    const token = drift.contract({
      abi: MockERC20.abi,
      address,
    });
    const decimals = await token.read("decimals");

    const hash = await token.write(
      "setBalance",
      {
        who: account,
        amount: parseUnits(balance, decimals),
      },
      {
        onMined: () => {
          signale.success(`Transaction success: ${hash}`);
        },
      },
    );

    signale.pending(`Transaction submitted: ${hash}`);
    await drift.waitForTransaction({ hash });
    next(hash);
  },
});
