import { Timelock } from "@delvtech/council-artifacts/Timelock";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for Timelock.setWaitTime",

  options: {
    t: {
      alias: ["wait-time"],
      description: "The new wait time (in seconds)",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const waitTime = await options.waitTime({
      prompt: "Enter new wait time (in seconds)",
    });

    const encoded = encodeFunctionData({
      abi: Timelock.abi,
      fn: "setWaitTime",
      args: { _waitTime: BigInt(waitTime) },
    });

    signale.success(encoded);
    next(encoded);
  },
});
