import { Authorizable } from "@council/artifacts/Authorizable";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Authorizable.deauthorize",

  options: {
    a: {
      alias: ["address", "who"],
      description: "The address to remove authorization from",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter address",
    });

    const encoded = encodeDeauthorize(address);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeDeauthorize(address: string): string {
  return encodeFunctionData({
    abi: Authorizable.abi,
    functionName: "deauthorize",
    args: [address as `0x${string}`],
  });
}
