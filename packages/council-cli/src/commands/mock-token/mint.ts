import { MockERC20 } from "@delvtech/council-artifacts/MockERC20";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";

export default command({
  description: "Mint tokens",

  options: {
    a: {
      alias: ["address"],
      description: "The token contract address.",
      type: "string",
      customType: "hex",
      required: true,
    },
    A: {
      alias: ["amount"],
      description: "The amount of tokens to mint.",
      type: "string",
      required: true,
    },
    c: {
      alias: ["account"],
      description: "The account to mint tokens for,",
      type: "string",
      customType: "hex",
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
      prompt: "Enter account to mint tokens for",
    });

    const amount = await options.amount({
      prompt: {
        message: "Enter amount of tokens to mint",
        initial: "0.0",
      },
    });

    const token = drift.contract({
      abi: MockERC20.abi,
      address,
    });
    const decimals = await token.read("decimals");

    const hash = await token.write(
      "mint",
      {
        account,
        amount: parseUnits(amount, decimals),
      },
      {
        onMined: () => {
          signale.success(`Transaction success: ${hash}`);
        },
      },
    );

    signale.pending(`Transaction submitted: ${hash}`);
    next(hash);
  },
});
