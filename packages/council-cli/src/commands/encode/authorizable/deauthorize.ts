import { Authorizable } from "@delvtech/council-artifacts/Authorizable";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for Authorizable.deauthorize",

  options: {
    a: {
      alias: ["address", "who"],
      description: "The address to remove authorization from",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter address",
    });

    const encoded = encodeFunctionData({
      abi: Authorizable.abi,
      fn: "deauthorize",
      args: { who: address },
    });

    signale.success(encoded);
    next(encoded);
  },
});
