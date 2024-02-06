import { GSCVault } from "@council/artifacts/GSCVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for GSCVault.setCoreVoting",

  options: {
    address: {
      alias: ["new-voting"],
      description: "The new core voting contract address",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const address = await options.address({
      prompt: "Enter core voting address",
    });
    const encoded = encodeSetCoreVoting(address);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetCoreVoting(address: string): string {
  return encodeFunctionData({
    abi: GSCVault.abi,
    functionName: "setCoreVoting",
    args: [address as `0x${string}`],
  });
}
