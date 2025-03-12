import { Timelock } from "@delvtech/council-artifacts/Timelock";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for Timelock.execute",

  options: {
    t: {
      alias: ["targets"],
      description:
        "A list of target addresses the timelock contract will call.",
      type: "array",
      customType: "hexArray",
      required: true,
    },
    d: {
      alias: ["calldatas"],
      description: "Encoded call data for each target.",
      type: "array",
      customType: "hexArray",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const targets = await options.targets({
      prompt: "Enter target addresses",
    });

    const calldatas = await options.calldatas({
      prompt: "Enter call data for each target",
    });

    const encoded = encodeFunctionData({
      abi: Timelock.abi,
      fn: "execute",
      args: { calldatas, targets },
    });

    signale.success(encoded);
    next(encoded);
  },
});
