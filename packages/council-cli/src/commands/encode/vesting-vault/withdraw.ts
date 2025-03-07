import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for VestingVault.withdraw",

  options: {
    a: {
      alias: ["amount"],
      description: "The amount of tokens to withdraw.",
      type: "string",
      required: true,
    },
    d: decimalsOption,
    r: {
      alias: ["recipient"],
      description: "The address to withdraw to.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const amount = await options.amount({
      prompt: {
        message: "Enter amount to withdraw",
        initial: "0.0",
      },
    });

    const decimals = await options.decimals();

    const recipient = await options.recipient({
      prompt: "Enter recipient address",
    });

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "withdraw",
      args: {
        _amount: parseUnits(amount, decimals),
        _recipient: recipient,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
