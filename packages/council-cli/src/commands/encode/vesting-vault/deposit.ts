import { VestingVault } from "@council/artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for VestingVault.deposit",

  options: {
    a: {
      alias: ["amount"],
      description: "The amount of tokens to deposit",
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
  },

  handler: async ({ options, next }) => {
    const amount = await options.amount({
      prompt: "Enter amount to deposit",
    });

    const decimals = await options.decimals();

    const encoded = encodeDeposit(amount, decimals);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeDeposit(amount: string, decimals: number): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "deposit",
    args: [parseUnits(amount as `${number}`, decimals)],
  });
}
