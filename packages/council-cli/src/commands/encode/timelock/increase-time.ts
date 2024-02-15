import { Timelock } from "@delvtech/council-artifacts/Timelock";
import { command } from "clide-js";
import signale from "signale";
import {
  callHashOptions,
  getCallHash,
} from "src/reusable-options/call-hash.js";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Timelock.increaseTime",

  options: {
    time: {
      description: "The amount of time (in seconds) to increase by",
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

    const encoded = encodeIncreaseTime(timeValue.toString(), callHash);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeIncreaseTime(
  timeValue: string,
  callHash: string,
): string {
  return encodeFunctionData({
    abi: Timelock.abi,
    functionName: "increaseTime",
    args: [BigInt(timeValue), callHash as `0x${string}`],
  });
}
