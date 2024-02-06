import { CoreVoting } from "@council/artifacts/CoreVoting";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for CoreVoting.setDefaultQuorum",

  options: {
    power: {
      alias: ["quorum"],
      description: "The new base quorum",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision used by the contract. The quorum option will be multiplied by (10 ** decimals). For example, if quorum is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
  },

  handler: async ({ options, next }) => {
    const power = await options.power({
      prompt: "Enter new base quorum",
    });

    const decimals = await options.decimals();

    const encoded = encodeSetDefaultQuorum(power, decimals);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetDefaultQuorum(
  quorum: string,
  decimals: number,
): string {
  return encodeFunctionData({
    abi: CoreVoting.abi,
    functionName: "setDefaultQuorum",
    args: [parseUnits(quorum, decimals)],
  });
}
