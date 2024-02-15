import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for CoreVoting.changeExtraVotingTime",

  options: {
    blocks: {
      alias: ["extra-vote-time"],
      description:
        "The number of blocks for which a proposal can still be voted on after it's unlocked",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const blocks = await options.blocks({
      prompt: "Enter extra voting time (in blocks)",
    });
    const encoded = encodeChangeExtraVotingTime(blocks);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeChangeExtraVotingTime(duration: number): string {
  return encodeFunctionData({
    abi: CoreVoting.abi,
    functionName: "changeExtraVotingTime",
    args: [BigInt(duration)],
  });
}
