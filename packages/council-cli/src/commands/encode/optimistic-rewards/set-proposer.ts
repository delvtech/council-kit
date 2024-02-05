import { OptimisticRewards } from "@council/artifacts/OptimisticRewards";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for OptimisticRewards.setProposer",

  options: {
    a: {
      alias: ["address", "proposer"],
      description: "The address of the new proposer",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter proposer address",
    });
    const encoded = encodeSetProposer(address);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetProposer(proposerAddress: string): string {
  return encodeFunctionData({
    abi: OptimisticRewards.abi,
    functionName: "setProposer",
    args: [proposerAddress as `0x${string}`],
  });
}
