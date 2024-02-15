import { OptimisticGrants } from "@delvtech/council-artifacts/OptimisticGrants";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for OptimisticGrants.claim",

  options: {
    recipient: {
      alias: ["destination"],
      description: "The address to send the tokens to",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const recipient = await options.recipient({
      prompt: "Enter recipient address",
    });
    const encoded = encodeClaim(recipient);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeClaim(recipient: string): string {
  return encodeFunctionData({
    abi: OptimisticGrants.abi,
    functionName: "claim",
    args: [recipient as `0x${string}`],
  });
}
