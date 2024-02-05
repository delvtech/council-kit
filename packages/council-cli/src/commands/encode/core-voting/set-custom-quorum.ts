import { CoreVoting } from "@council/artifacts/CoreVoting";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for CoreVoting.setCustomQuorum",

  options: {
    t: {
      alias: ["target"],
      description: "The address to set a custom quorum for",
      type: "string",
      required: true,
    },
    f: {
      alias: ["function", "selector"],
      description: "The 4 byte function selector to set a custom quorum for",
      type: "string",
      required: true,
    },
    p: {
      alias: ["power", "quorum"],
      description:
        "A new base quorum for the specific function (e.g. 0x12345678)",
      type: "string",
      required: true,
    },
    d: {
      alias: ["decimals"],
      description:
        "The decimal precision used by the contract. The power option will be multiplied by (10 ** decimals). For example, if power is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
  },

  handler: async ({ options, next }) => {
    const target = await options.target({
      prompt: "Enter target address",
    });

    const selector = await options.selector({
      prompt: "Enter 4 byte function selector",
    });

    const power = await options.power({
      prompt: "Enter new base quorum",
    });

    const decimals = await options.decimals();

    const encoded = encodeSetCustomQuorum(target, selector, power, decimals);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetCustomQuorum(
  target: string,
  selector: string,
  quorum: string,
  decimals: number,
): string {
  return encodeFunctionData({
    abi: CoreVoting.abi,
    functionName: "setCustomQuorum",
    args: [
      target as `0x${string}`,
      selector as `0x${string}`,
      parseUnits(quorum as `${number}`, decimals),
    ],
  });
}
