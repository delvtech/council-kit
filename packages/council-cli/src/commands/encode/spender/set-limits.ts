import { Spender } from "@delvtech/council-artifacts/Spender";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for a Spender.setLimits",

  options: {
    s: {
      alias: ["small"],
      description: "The new small spend limit",
      type: "string",
      required: true,
    },
    m: {
      alias: ["medium"],
      description: "The new medium spend limit",
      type: "string",
      required: true,
    },
    h: {
      alias: ["high"],
      description: "The new high spend limit",
      type: "string",
      required: true,
    },
    d: decimalsOption,
  },

  handler: async ({ options, next }) => {
    const small = await options.small({
      prompt: "Enter small spend limit",
    });

    const medium = await options.medium({
      prompt: "Enter medium spend limit",
    });

    const high = await options.high({
      prompt: "Enter high spend limit",
    });

    const decimals = await options.decimals();

    const encoded = encodeFunctionData({
      abi: Spender.abi,
      fn: "setLimits",
      args: {
        limits: [
          parseUnits(small, decimals),
          parseUnits(medium, decimals),
          parseUnits(high, decimals),
        ],
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
