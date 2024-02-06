import { OptimisticRewards } from "@council/artifacts/OptimisticRewards";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for OptimisticRewards.proposeRewards",

  options: {
    root: {
      description: "The merkle root of the proposed new rewards",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const root = await options.root({
      prompt: "Enter rewards merkle root",
    });

    const encoded = encodeProposeRewards(root);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeProposeRewards(root: string): string {
  return encodeFunctionData({
    abi: OptimisticRewards.abi,
    functionName: "proposeRewards",
    args: [root as `0x${string}`],
  });
}
