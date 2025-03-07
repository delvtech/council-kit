import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for VestingVault.deposit",

  options: {
    a: {
      alias: ["amount"],
      description: "The amount of tokens to deposit.",
      type: "string",
      required: true,
    },
    d: decimalsOption,
  },

  handler: async ({ options, next }) => {
    const amount = await options.amount({
      prompt: "Enter amount to deposit",
    });

    const decimals = await options.decimals();

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "deposit",
      args: { _amount: parseUnits(amount, decimals) },
    });

    signale.success(encoded);
    next(encoded);
  },
});
