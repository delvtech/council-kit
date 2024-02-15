import { GSCVault } from "@delvtech/council-artifacts/GSCVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for GSCVault.setVotePowerBound",

  options: {
    bound: {
      alias: ["power"],
      description: "The new required voting power to become a member",
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
      prompt: "Enter new voting power bound",
    });

    const decimals = await options.decimals();

    const encoded = encodeSetVotePowerBound(power, decimals);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetVotePowerBound(
  power: string,
  decimals: number,
): string {
  return encodeFunctionData({
    abi: GSCVault.abi,
    functionName: "setVotePowerBound",
    args: [parseUnits(power, decimals)],
  });
}
