import { Spender } from "@delvtech/council-artifacts/Spender";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for a Spender.removeToken",

  options: {
    amount: {
      description:
        "The amount of tokens to remove (max uint256 for the full balance)",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    destination: {
      description: "The address to send the funds to",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const amount = await options.amount({
      prompt: "Enter amount to remove (max uint256 for the full balance)",
    });

    const decimals = await options.decimals();

    const destination = await options.destination({
      prompt: "Enter destination address",
    });

    const encoded = encodeRemoveToken(amount, decimals, destination);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeRemoveToken(
  amount: string,
  decimals: number,
  destination: string,
): string {
  return encodeFunctionData({
    abi: Spender.abi,
    functionName: "removeToken",
    args: [parseUnits(amount, decimals), destination as `0x${string}`],
  });
}
