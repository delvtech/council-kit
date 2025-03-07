import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for VestingVault.delegate",

  options: {
    t: {
      alias: ["to", "address"],
      description: "The address to delegate to.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const to = await options.to({
      prompt: "Enter new delegate address",
    });

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "delegate",
      args: { _to: to },
    });

    signale.success(encoded);
    next(encoded);
  },
});
