import { OptimisticGrants } from "@delvtech/council-artifacts/OptimisticGrants";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for OptimisticGrants.claim",

  options: {
    r: {
      alias: ["recipient", "destination"],
      description: "The address to send the tokens to.",
      type: "string",
      customType: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const destination = await options.destination({
      prompt: "Enter recipient address",
    });

    const encoded = encodeFunctionData({
      abi: OptimisticGrants.abi,
      fn: "claim",
      args: { _destination: destination },
    });

    signale.success(encoded);
    next(encoded);
  },
});
