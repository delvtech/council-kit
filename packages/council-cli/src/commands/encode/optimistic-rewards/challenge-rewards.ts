import { OptimisticRewards } from "@delvtech/council-artifacts/OptimisticRewards";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for OptimisticRewards.challengeRewards",

  handler: async ({ next }) => {
    const encoded = encodeFunctionData({
      abi: OptimisticRewards.abi,
      fn: "challengeRewards",
    });
    signale.success(encoded);
    next(encoded);
  },
});
