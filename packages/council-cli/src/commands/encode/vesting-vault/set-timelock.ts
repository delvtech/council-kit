import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for VestingVault.setTimelock",

  options: {
    address: {
      alias: ["timelock"],
      description: "The new timelock address",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter new timelock address",
    });

    const encoded = encodeSetTimelock(address);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetTimelock(address: string): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "setTimelock",
    args: [address as `0x${string}`],
  });
}
