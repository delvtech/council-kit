import { Treasury } from "@council/artifacts/Treasury";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for Treasury.approve",

  options: {
    token: {
      description: `The address of the token to approve`,
      type: "string",
      required: true,
    },
    amount: {
      description: "The amount to approve",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    spender: {
      description: "The address to approve",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const token = await options.token({
      prompt: "Enter token address",
    });

    const amount = await options.amount({
      prompt: "Enter amount to approve",
    });

    const decimals = await options.decimals();

    const spender = await options.spender({
      prompt: "Enter spender address",
    });

    const encoded = encodeApprove(token, amount, decimals, spender);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeApprove(
  token: string,
  amount: string,
  decimals: number,
  spender: string,
): string {
  return encodeFunctionData({
    abi: Treasury.abi,
    functionName: "approve",
    args: [
      token as `0x${string}`,
      spender as `0x${string}`,
      parseUnits(amount, decimals),
    ],
  });
}
