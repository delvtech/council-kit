import { Airdrop } from "@council/artifacts/Airdrop";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Airdrop.reclaim",

  options: {
    r: {
      alias: ["recipient", "destination"],
      description: "The recipient of the reclaimed funds",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const recipient = await options.recipient({
      prompt: "Enter recipient address",
    });
    const encoded = encodeReclaim(recipient);
    signale.success(encoded);
    next(encoded);
  },
});

function encodeReclaim(recipient: string) {
  return encodeFunctionData({
    abi: Airdrop.abi,
    functionName: "reclaim",
    args: [recipient as `0x${string}`],
  });
}
