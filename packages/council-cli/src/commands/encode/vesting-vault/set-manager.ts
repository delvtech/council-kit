import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for VestingVault.setManager",

  options: {
    m: {
      alias: ["manager", "address"],
      description: "The new manager address.",
      type: "string",
      customType: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const manager = await options.manager({
      prompt: "Enter new manager address",
    });

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "setManager",
      args: { manager_: manager },
    });

    signale.success(encoded);
    next(encoded);
  },
});
