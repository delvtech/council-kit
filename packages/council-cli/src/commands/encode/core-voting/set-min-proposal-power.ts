import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for CoreVoting.setMinProposalPower",

  options: {
    power: {
      alias: ["min-proposal-power"],
      description: "The minimum voting power required to create a proposal",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision used by the contract. The power option will be multiplied by (10 ** decimals). For example, if power is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
  },

  handler: async ({ options, next }) => {
    const power = await options.power({
      prompt: "Enter minimum voting power",
    });

    const decimals = await options.decimals();

    const encoded = encodeSetMinProposalPower(power, decimals);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetMinProposalPower(
  power: string,
  decimals: number,
): string {
  return encodeFunctionData({
    abi: CoreVoting.abi,
    functionName: "setMinProposalPower",
    args: [parseUnits(power, decimals)],
  });
}
