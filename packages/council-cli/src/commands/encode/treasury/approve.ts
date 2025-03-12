import { Treasury } from "@delvtech/council-artifacts/Treasury";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for Treasury.approve",

  options: {
    t: {
      alias: ["token"],
      description: "The address of the token to approve.",
      type: "string",
      customType: "hex",
      required: true,
    },
    a: {
      alias: ["amount"],
      description: "The amount to approve.",
      type: "string",
      required: true,
    },
    d: decimalsOption,
    s: {
      alias: ["spender"],
      description: "The address to approve.",
      type: "string",
      customType: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const token = await options.token({
      prompt: "Enter token address",
    });

    const amount = await options.amount({
      prompt: "Enter amount to approve",
    });

    const decimals = await options.decimals();

    const spender = await options.spender({
      prompt: "Enter spender address",
    });

    const encoded = encodeFunctionData({
      abi: Treasury.abi,
      fn: "approve",
      args: {
        _amount: parseUnits(amount, decimals),
        _spender: spender,
        _token: token,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
