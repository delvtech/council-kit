import { VestingVault } from "@council/artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for VestingVault.initialize",

  options: {
    manager: {
      description: "The address that will be able add and remove grants",
      type: "string",
      required: true,
    },
    timelock: {
      description:
        "The address that will be able to change the unvested multiplier, the manager, and the timelock",
      type: "string",
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

    const encoded = encodeInitialize(manager, timelock);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeInitialize(manager: string, timelock: string): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "initialize",
    args: [manager as `0x${string}`, timelock as `0x${string}`],
  });
}
