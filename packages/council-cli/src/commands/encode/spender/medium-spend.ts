import { Spender } from "@delvtech/council-artifacts/Spender";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for a Spender.mediumSpend",

  options: {
    a: {
      alias: ["amount"],
      description: "The amount to spend.",
      type: "string",
      required: true,
    },
    d: decimalsOption,
    D: {
      alias: ["destination"],
      description: "The address to send the funds to.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const amount = await options.amount({
      prompt: "Enter amount to spend",
    });

    const decimals = await options.decimals();

    const destination = await options.destination({
      prompt: "Enter destination address",
    });

    const encoded = encodeFunctionData({
      abi: Spender.abi,
      fn: "mediumSpend",
      args: {
        amount: parseUnits(amount, decimals),
        destination,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
