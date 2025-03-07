import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for CoreVoting.setLockDuration",

  options: {
    b: {
      alias: ["blocks", "lock-duration"],
      description:
        "The number of blocks that must pass before a new proposal can be executed.",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const blocks = await options.blocks({
      prompt: "Enter new lock duration (in blocks)",
    });

    const encoded = encodeFunctionData({
      abi: CoreVoting.abi,
      fn: "setLockDuration",
      args: { _lockDuration: BigInt(blocks) },
    });

    signale.success(encoded);
    next(encoded);
  },
});
