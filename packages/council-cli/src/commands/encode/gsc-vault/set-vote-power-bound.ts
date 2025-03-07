import { GSCVault } from "@delvtech/council-artifacts/GSCVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseEther } from "viem";

export default command({
  description: "Encode call data for GSCVault.setVotePowerBound",

  options: {
    p: {
      alias: ["power", "new-bound"],
      description: "The new required voting power to become a member.",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const newBound = await options.newBound({
      prompt: "Enter new voting power bound",
    });

    const encoded = encodeFunctionData({
      abi: GSCVault.abi,
      fn: "setVotePowerBound",
      args: { _newBound: parseEther(newBound) },
    });

    signale.success(encoded);
    next(encoded);
  },
});
