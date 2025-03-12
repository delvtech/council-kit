import { GSCVault } from "@delvtech/council-artifacts/GSCVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for GSCVault.setCoreVoting",

  options: {
    a: {
      alias: ["address", "new-voting"],
      description: "The new core voting contract address.",
      type: "string",
      customType: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter core voting address",
    });

    const encoded = encodeFunctionData({
      abi: GSCVault.abi,
      fn: "setCoreVoting",
      args: { _newVoting: address },
    });

    signale.success(encoded);
    next(encoded);
  },
});
