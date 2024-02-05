import { Spender } from "@council/artifacts/Spender";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

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
    d: {
      alias: ["decimals"],
      description:
        "The decimal precision used by the contract. The amount options will be multiplied by (10 ** decimals). For example, if small is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
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

    const encoded = encodeSetLimits(small, medium, high, decimals);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetLimits(
  small: string,
  medium: string,
  high: string,
  decimals: number,
): string {
  return encodeFunctionData({
    abi: Spender.abi,
    functionName: "setLimits",
    args: [
      [
        parseUnits(small, decimals),
        parseUnits(medium, decimals),
        parseUnits(high, decimals),
      ],
    ],
  });
}
