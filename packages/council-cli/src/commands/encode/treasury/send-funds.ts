import { Treasury } from "@council/artifacts/Treasury";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

const ETH_CONSTANT = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export default command({
  description: "Encode call data for Treasury.sendFunds",

  options: {
    t: {
      alias: ["token"],
      description: `The address of token to send (${ETH_CONSTANT} to send ETH)`,
      type: "string",
      required: true,
    },
    a: {
      alias: ["amount"],
      description: "The amount to send",
      type: "string",
      required: true,
    },
    d: {
      alias: ["decimals"],
      description:
        "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    r: {
      alias: ["recipient"],
      description: "The address to send the funds to",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const token = await options.token({
      prompt: {
        message: "Enter token address",
        initial: ETH_CONSTANT,
      },
    });

    const amount = await options.amount({
      prompt: "Enter amount to send",
    });

    const decimals = await options.decimals();

    const recipient = await options.recipient({
      prompt: "Enter recipient address",
    });

    const encoded = encodeSendFunds(token, amount, decimals, recipient);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSendFunds(
  token: string,
  amount: string,
  decimals: number,
  recipient: string,
): string {
  return encodeFunctionData({
    abi: Treasury.abi,
    functionName: "sendFunds",
    args: [
      token as `0x${string}`,
      parseUnits(amount as `${number}`, decimals),
      recipient as `0x${string}`,
    ],
  });
}
