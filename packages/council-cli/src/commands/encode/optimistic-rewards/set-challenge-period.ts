import { OptimisticRewards } from "@council/artifacts/OptimisticRewards";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for OptimisticRewards.setChallengePeriod",

  options: {
    p: {
      alias: ["period"],
      description: "The new challenge period (in seconds)",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const period = await options.period({
      prompt: "Enter challenge period (in seconds)",
    });

    const encoded = encodeSetChallengePeriod(period);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetChallengePeriod(period: number): string {
  return encodeFunctionData({
    abi: OptimisticRewards.abi,
    functionName: "setChallengePeriod",
    args: [BigInt(period)],
  });
}
