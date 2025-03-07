import { LockingVault } from "@delvtech/council-artifacts/LockingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for LockingVault.changeDelegation",

  options: {
    a: {
      alias: ["address", "new-delegate"],
      description: "The address to delegate to.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const newDelegate = await options.newDelegate({
      prompt: "Enter new delegate address",
    });

    const encoded = encodeFunctionData({
      abi: LockingVault.abi,
      fn: "changeDelegation",
      args: { newDelegate },
    });

    signale.success(encoded);
    next(encoded);
  },
});
