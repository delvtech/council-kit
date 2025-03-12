import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for VestingVault.initialize",

  options: {
    m: {
      alias: ["manager"],
      description: "The address that will be able add and remove grants.",
      type: "string",
      customType: "hex",
      required: true,
    },
    t: {
      alias: ["timelock"],
      description:
        "The address that will be able to change the unvested multiplier, the manager, and the timelock.",
      type: "string",
      customType: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const manager = await options.manager({
      prompt: "Enter manager address",
    });

    const timelock = await options.timelock({
      prompt: "Enter timelock address",
    });

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "initialize",
      args: {
        manager_: manager,
        timelock_: timelock,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
