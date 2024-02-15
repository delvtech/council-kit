import { Timelock } from "@delvtech/council-artifacts/Timelock";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Timelock.setWaitTime",

  options: {
    time: {
      alias: ["wait-time"],
      description: "The new wait time (in seconds)",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const time = await options.time({
      prompt: "Enter new wait time (in seconds)",
    });

    const encoded = encodeSetWaitTime(time.toString());

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetWaitTime(waitTime: string): string {
  return encodeFunctionData({
    abi: Timelock.abi,
    functionName: "setWaitTime",
    args: [BigInt(waitTime)],
  });
}
