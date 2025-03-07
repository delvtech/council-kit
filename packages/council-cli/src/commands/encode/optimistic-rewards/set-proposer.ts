import { OptimisticRewards } from "@delvtech/council-artifacts/OptimisticRewards";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for OptimisticRewards.setProposer",

  options: {
    p: {
      alias: ["proposer"],
      description: "The address of the new proposer.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const proposer = await options.proposer({
      prompt: "Enter proposer address",
    });

    const encoded = encodeFunctionData({
      abi: OptimisticRewards.abi,
      fn: "setProposer",
      args: { _proposer: proposer },
    });

    signale.success(encoded);
    next(encoded);
  },
});
