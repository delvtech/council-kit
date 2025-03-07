import { OptimisticRewards } from "@delvtech/council-artifacts/OptimisticRewards";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for OptimisticRewards.proposeRewards",

  options: {
    r: {
      alias: ["new-root"],
      description: "The merkle root of the proposed new rewards.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const newRoot = await options.newRoot({
      prompt: "Enter rewards merkle root",
    });

    const encoded = encodeFunctionData({
      abi: OptimisticRewards.abi,
      fn: "proposeRewards",
      args: { newRoot },
    });

    signale.success(encoded);
    next(encoded);
  },
});
