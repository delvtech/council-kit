import { VestingVault } from "@council/artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for VestingVault.updateVotingPower",

  options: {
    address: {
      alias: ["who"],
      description: "The address to update voting power for",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const who = await options.who({
      prompt: "Enter voter's address",
    });

    const encoded = encodeUpdateVotingPower(who);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeUpdateVotingPower(who: string): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "updateVotingPower",
    args: [who as `0x${string}`],
  });
}
