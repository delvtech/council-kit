import { OptimisticRewards__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "challenge-rewards [OPTIONS]",
    aliases: ["challengeRewards"],
    describe: "Encode call data for OptimisticRewards.challengeRewards",

    handler: async () => {
      signale.success(encodeChallengeRewards());
    },
  });

export function encodeChallengeRewards(): string {
  const optimisticRewardsInterface = new Interface(
    OptimisticRewards__factory.abi,
  );
  return optimisticRewardsInterface.encodeFunctionData("challengeRewards", []);
}
