import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for VestingVault.changeUnvestedMultiplier",

  options: {
    multiplier: {
      description: "The new multiplier as a percentage",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const multiplier = await options.multiplier({
      prompt: "Enter new multiplier (%)",
    });

    const encoded = encodeChangeUnvestedMultiplier(multiplier);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeChangeUnvestedMultiplier(multiplier: number): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "changeUnvestedMultiplier",
    args: [BigInt(multiplier)],
  });
}
