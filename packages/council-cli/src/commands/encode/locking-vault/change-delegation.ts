import { LockingVault } from "@council/artifacts/LockingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for LockingVault.changeDelegation",

  options: {
    a: {
      alias: ["address", "new-delegate"],
      description: "The address to delegate to",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter new delegate address",
    });
    const encoded = encodeChangeDelegation(address);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeChangeDelegation(address: string): string {
  return encodeFunctionData({
    abi: LockingVault.abi,
    functionName: "changeDelegation",
    args: [address as `0x${string}`],
  });
}
