import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for VestingVault.updateVotingPower",

  options: {
    w: {
      alias: ["who", "address"],
      description: "The address to update voting power for.",
      type: "string",
      customType: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const who = await options.who({
      prompt: "Enter voter's address",
    });

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "updateVotingPower",
      args: { _who: who },
    });

    signale.success(encoded);
    next(encoded);
  },
});
