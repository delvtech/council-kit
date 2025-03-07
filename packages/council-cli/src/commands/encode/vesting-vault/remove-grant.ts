import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for VestingVault.removeGrant",

  options: {
    w: {
      alias: ["who", "address"],
      description: "The grant owner.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const who = await options.who({
      prompt: "Enter grantee address",
    });

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "removeGrant",
      args: { _who: who },
    });

    signale.success(encoded);
    next(encoded);
  },
});
