import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for VestingVault.withdraw",

  options: {
    amount: {
      description: "The amount of tokens to withdraw",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    recipient: {
      description: "The address to withdraw to",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const amount = await options.amount({
      prompt: {
        message: "Enter amount to withdraw",
        initial: "0.0",
      },
    });

    const decimals = await options.decimals();

    const recipient = await options.recipient({
      prompt: "Enter recipient address",
    });

    const encoded = encodeDeposit(amount, decimals, recipient);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeDeposit(
  amount: string,
  decimals: number,
  recipient: string,
): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "withdraw",
    args: [parseUnits(amount, decimals), recipient as `0x${string}`],
  });
}
