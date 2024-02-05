import { VestingVault } from "@council/artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for VestingVault.setManager",

  options: {
    a: {
      alias: ["address", "manager"],
      description: "The new manager address",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter new manager address",
    });

    const encoded = encodeSetManager(address);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetManager(address: string): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "setManager",
    args: [address as `0x${string}`],
  });
}
