import { OptimisticRewards__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

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
  return encodeFunctionData({
    abi: OptimisticRewards__factory.abi,
    functionName: "setChallengePeriod",
    args: [period],
  });
}
