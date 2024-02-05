import { Authorizable } from "@council/artifacts/Authorizable";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Authorizable.setOwner",

  options: {
    a: {
      alias: ["address", "who"],
      description: "The address to set as the owner",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter owner address",
    });

    const encoded = encodeSetOwner(address);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetOwner(address: string): string {
  return encodeFunctionData({
    abi: Authorizable.abi,
    functionName: "setOwner",
    args: [address as `0x${string}`],
  });
}
