import { OptimisticRewards } from "@delvtech/council-artifacts/OptimisticRewards";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for OptimisticRewards.setChallengePeriod",

  options: {
    p: {
      alias: ["challenge-period"],
      description: "The new challenge period (in seconds).",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const challengePeriod = await options.challengePeriod({
      prompt: "Enter challenge period (in seconds)",
    });

    const encoded = encodeFunctionData({
      abi: OptimisticRewards.abi,
      fn: "setChallengePeriod",
      args: { _challengePeriod: BigInt(challengePeriod) },
    });

    signale.success(encoded);
    next(encoded);
  },
});
