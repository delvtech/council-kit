import { Authorizable } from "@delvtech/council-artifacts/Authorizable";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for Authorizable.setOwner",

  options: {
    a: {
      alias: ["address", "who"],
      description: "The address to set as the owner",
      type: "string",
      customType: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter owner address",
    });

    const encoded = encodeFunctionData({
      abi: Authorizable.abi,
      fn: "setOwner",
      args: { who: address },
    });

    signale.success(encoded);
    next(encoded);
  },
});
