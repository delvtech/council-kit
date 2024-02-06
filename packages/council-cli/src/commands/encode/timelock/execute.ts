import { Timelock } from "@council/artifacts/Timelock";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Timelock.execute",

  options: {
    targets: {
      description: "A list of target addresses the timelock contract will call",
      type: "array",
      required: true,
    },
    data: {
      alias: ["calldatas"],
      description: "Encoded call data for each target",
      type: "array",
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

    const encoded = encodeExecute(targets, calldatas);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeExecute(targets: string[], calldatas: string[]): string {
  return encodeFunctionData({
    abi: Timelock.abi,
    functionName: "execute",
    args: [targets as `0x${string}`[], calldatas as `0x${string}`[]],
  });
}
