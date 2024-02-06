import { Authorizable } from "@council/artifacts/Authorizable";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Authorizable.authorize",

  options: {
    address: {
      alias: ["who"],
      description: "The address to authorize",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter address",
    });

    const encoded = encodeAuthorize(address);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeAuthorize(address: string): string {
  return encodeFunctionData({
    abi: Authorizable.abi,
    functionName: "authorize",
    args: [address as `0x${string}`],
  });
}
