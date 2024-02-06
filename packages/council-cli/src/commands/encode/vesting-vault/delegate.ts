import { VestingVault } from "@council/artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for VestingVault.delegate",

  options: {
    address: {
      alias: ["to"],
      description: "The address to delegate to",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter new delegate address",
    });

    const encoded = encodeDelegate(address);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeDelegate(address: string): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "delegate",
    args: [address as `0x${string}`],
  });
}
