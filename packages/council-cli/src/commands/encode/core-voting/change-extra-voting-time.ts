import { CoreVoting__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "change-extra-voting-time [OPTIONS]",
    aliases: ["changeExtraVotingTime"],
    describe: "Encode call data for CoreVoting.changeExtraVotingTime",

    builder: (yargs) => {
      return yargs.options({
        b: {
          alias: ["blocks", "extra-vote-time", "extraVoteTime"],
          describe:
            "The number of blocks for which a proposal can still be voted on after it's unlocked",
          type: "number",
        },
      });
    },

    handler: async (args) => {
      const blocks = await requiredNumber(args.blocks, {
        name: "blocks",
        message: "Enter extra voting time (in blocks)",
      });

      signale.success(encodeChangeExtraVotingTime(blocks));
    },
  });

export function encodeChangeExtraVotingTime(duration: number): string {
  return encodeFunctionData({
    abi: CoreVoting__factory.abi,
    functionName: "changeExtraVotingTime",
    args: [duration],
  });
}
