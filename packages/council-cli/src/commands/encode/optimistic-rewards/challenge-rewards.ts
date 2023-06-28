import { OptimisticRewards__factory } from "@council/typechain";
import signale from "signale";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, handler } = createCommandModule({
  command: "challenge-rewards [OPTIONS]",
  aliases: ["challengeRewards"],
  describe: "Encode call data for OptimisticRewards.challengeRewards",

  handler: async () => {
    signale.success(encodeChallengeRewards());
  },
});

export function encodeChallengeRewards(): string {
  return encodeFunctionData({
    abi: OptimisticRewards__factory.abi,
    functionName: "challengeRewards",
  });
}
