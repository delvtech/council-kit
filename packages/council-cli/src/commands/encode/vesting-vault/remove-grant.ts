import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for VestingVault.removeGrant",

  options: {
    address: {
      alias: ["who"],
      description: "The grant owner",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const who = await options.who({
      prompt: "Enter owner address",
    });

    const encoded = encodeRemoveGrant(who);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeRemoveGrant(who: string): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "removeGrant",
    args: [who as `0x${string}`],
  });
}
