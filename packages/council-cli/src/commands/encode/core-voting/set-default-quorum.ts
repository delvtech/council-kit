import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseEther } from "viem";

export default command({
  description: "Encode call data for CoreVoting.setDefaultQuorum",

  options: {
    q: {
      alias: ["quorum"],
      description: "The new base quorum.",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const quorum = await options.quorum({
      prompt: "Enter new base quorum",
    });

    const encoded = encodeFunctionData({
      abi: CoreVoting.abi,
      fn: "setDefaultQuorum",
      args: { quorum: parseEther(quorum) },
    });

    signale.success(encoded);
    next(encoded);
  },
});
