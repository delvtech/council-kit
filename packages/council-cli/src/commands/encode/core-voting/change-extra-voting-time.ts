import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for CoreVoting.changeExtraVotingTime",

  options: {
    b: {
      alias: ["blocks", "extra-vote-time"],
      description:
        "The number of blocks for which a proposal can still be voted on after it's unlocked",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const blocks = await options.extraVoteTime({
      prompt: "Enter extra voting time (in blocks)",
    });

    const encoded = encodeFunctionData({
      abi: CoreVoting.abi,
      fn: "changeExtraVotingTime",
      args: { _extraVoteTime: BigInt(blocks) },
    });

    signale.success(encoded);
    next(encoded);
  },
});
