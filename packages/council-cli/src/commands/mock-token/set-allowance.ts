import { MockERC20 } from "@delvtech/council-artifacts/MockERC20";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";

export default command({
  description: "Set an account's token allowance",

  options: {
    a: {
      alias: ["address"],
      description: "The token contract address.",
      type: "string",
      customType: "hex",
      required: true,
    },
    o: {
      alias: ["owner", "source"],
      description: "The address of the token owner.",
      type: "string",
      customType: "hex",
      required: true,
    },
    s: {
      alias: ["spender"],
      description: "The address of the token spender.",
      type: "string",
      customType: "hex",
      required: true,
    },
    A: {
      alias: ["allowance"],
      description:
        "The amount of tokens the spender is allowed to spend from the owner's account as a decimals string.",
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

    const owner = await options.owner({
      prompt: "Enter the token owner's address",
    });

    const spender = await options.spender({
      prompt: "Enter the token spender's address",
    });

    const allowance = await options.allowance({
      prompt: {
        message:
          "Enter amount of tokens the spender is allowed to spend from the owner's account",
        initial: "0.0",
      },
    });

    const token = drift.contract({
      abi: MockERC20.abi,
      address,
    });
    const decimals = await token.read("decimals");

    const hash = await token.write(
      "setAllowance",
      {
        amount: parseUnits(allowance, decimals),
        source: owner,
        spender,
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
