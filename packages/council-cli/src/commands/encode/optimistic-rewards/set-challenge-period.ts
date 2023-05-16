import { OptimisticRewards__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-challenge-period [OPTIONS]",
    aliases: ["setChallengePeriod"],
    describe: "Encode call data for OptimisticRewards.setChallengePeriod",

    builder: (yargs) => {
      return yargs.options({
        p: {
          alias: ["period"],
          describe: "The new challenge period (in seconds)",
          type: "number",
        },
      });
    },

    handler: async (args) => {
      const period = await requiredNumber(args.period, {
        name: "period",
        message: "Enter challenge period (in seconds)",
      });

      signale.success(encodeSetChallengePeriod(period));
    },
  });

export function encodeSetChallengePeriod(period: number): string {
  const optimisticRewardsInterface = new Interface(
    OptimisticRewards__factory.abi,
  );
  return optimisticRewardsInterface.encodeFunctionData("setChallengePeriod", [
    period,
  ]);
}
