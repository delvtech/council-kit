import { Timelock } from "@delvtech/council-artifacts/Timelock";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { callHashOptions, getCallHash } from "../../../options/call-hash.js";

export default command({
  description: "Encode call data for Timelock.increaseTime",

  options: {
    t: {
      alias: ["time"],
      description: "The amount of time (in seconds) to increase by.",
      type: "number",
      required: true,
    },
    ...callHashOptions,
  },

  handler: async ({ options, next }) => {
    const timeValue = await options.time({
      prompt: "Enter amount of time (in seconds) to increase by",
    });

    const callHash = await getCallHash(
      options.callHash,
      options.targets,
      options.calldatas,
    );

    const encoded = encodeFunctionData({
      abi: Timelock.abi,
      fn: "increaseTime",
      args: {
        callHash,
        timeValue: BigInt(timeValue),
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
