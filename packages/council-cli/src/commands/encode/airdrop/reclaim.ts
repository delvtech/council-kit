import { Airdrop } from "@delvtech/council-artifacts/Airdrop";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for Airdrop.reclaim",

  options: {
    d: {
      alias: ["destination"],
      description: "The recipient of the reclaimed funds",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const destination = await options.destination({
      prompt: "Enter destination address",
    });

    const encoded = encodeFunctionData({
      abi: Airdrop.abi,
      fn: "reclaim",
      args: { destination },
    });

    signale.success(encoded);
    next(encoded);
  },
});
