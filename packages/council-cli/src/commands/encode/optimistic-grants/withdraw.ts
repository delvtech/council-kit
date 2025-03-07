import { OptimisticGrants } from "@delvtech/council-artifacts/OptimisticGrants";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for OptimisticGrants.withdraw",

  options: {
    a: {
      alias: ["amount"],
      description: "The amount of tokens to withdraw.",
      type: "string",
      required: true,
    },
    d: decimalsOption,
    r: {
      alias: ["recipient", "destination"],
      description: "The address to withdraw to.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const amount = await options.amount({
      prompt: "Enter amount to withdraw",
    });

    const decimals = await options.decimals();

    const recipient = await options.recipient({
      prompt: "Enter recipient address",
    });

    const encoded = encodeFunctionData({
      abi: OptimisticGrants.abi,
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
