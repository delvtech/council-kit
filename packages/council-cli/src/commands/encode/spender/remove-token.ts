import { Spender } from "@delvtech/council-artifacts/Spender";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for a Spender.removeToken",

  options: {
    a: {
      alias: ["amount"],
      description:
        "The amount of tokens to remove (max uint256 for the full balance)",
      type: "hex",
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
      prompt: "Enter amount to remove (max uint256 for the full balance)",
    });

    const decimals = await options.decimals();

    const destination = await options.destination({
      prompt: "Enter destination address",
    });

    const encoded = encodeFunctionData({
      abi: Spender.abi,
      fn: "removeToken",
      args: {
        amount: parseUnits(amount, decimals),
        destination,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
