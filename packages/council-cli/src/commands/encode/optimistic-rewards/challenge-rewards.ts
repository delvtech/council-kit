import { OptimisticRewards } from "@council/artifacts/OptimisticRewards";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for OptimisticRewards.challengeRewards",

  handler: async ({ next }) => {
    const encoded = encodeChallengeRewards();
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeChallengeRewards(): string {
  return encodeFunctionData({
    abi: OptimisticRewards.abi,
    functionName: "challengeRewards",
  });
}
