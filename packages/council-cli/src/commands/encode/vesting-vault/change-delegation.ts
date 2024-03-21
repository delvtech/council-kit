import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for VestingVault.changeDelegation",

  options: {
    address: {
      alias: ["new-delegate", "newDelegate"],
      description: "The amount of tokens to deposit",
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
    abi: VestingVault.abi,
    functionName: "delegate",
    args: [address as `0x${string}`],
  });
}
