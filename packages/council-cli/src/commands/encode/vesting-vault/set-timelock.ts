import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for VestingVault.setTimelock",

  options: {
    t: {
      alias: ["timelock", "address"],
      description: "The new timelock address.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const timelock = await options.timelock({
      prompt: "Enter new timelock address",
    });

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "setTimelock",
      args: { timelock_: timelock },
    });

    signale.success(encoded);
    next(encoded);
  },
});
