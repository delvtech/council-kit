import { Treasury } from "@council/artifacts/Treasury";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Treasury.genericCall",

  options: {
    target: {
      description: `The address of the target contract`,
      type: "string",
      required: true,
    },
    data: {
      alias: ["calldata", "call-data"],
      description: "The encoded call data",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const target = await options.target({
      prompt: "Enter target address",
    });

    const data = await options.data({
      prompt: "Enter call data",
    });

    const encoded = encodeGenericCall(target, data);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeGenericCall(target: string, data: string): string {
  return encodeFunctionData({
    abi: Treasury.abi,
    functionName: "genericCall",
    args: [target as `0x${string}`, data as `0x${string}`],
  });
}
