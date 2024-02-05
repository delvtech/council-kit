import { CoreVoting } from "@council/artifacts/CoreVoting";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for CoreVoting.setLockDuration",

  options: {
    b: {
      alias: ["blocks", "lock-duration"],
      description:
        "The number of blocks that must pass before a new proposal can be executed",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const blocks = await options.blocks({
      prompt: "Enter new lock duration (in blocks)",
    });
    const encoded = encodeSetLockDuration(blocks);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetLockDuration(duration: number): string {
  return encodeFunctionData({
    abi: CoreVoting.abi,
    functionName: "setLockDuration",
    args: [BigInt(duration)],
  });
}
