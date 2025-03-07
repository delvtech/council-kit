import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for VestingVault.changeUnvestedMultiplier",

  options: {
    m: {
      alias: ["multiplier"],
      description: "The new multiplier as a percentage.",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const multiplier = await options.multiplier({
      prompt: "Enter new multiplier (%)",
    });

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "changeUnvestedMultiplier",
      args: { _multiplier: BigInt(multiplier) },
    });

    signale.success(encoded);
    next(encoded);
  },
});
