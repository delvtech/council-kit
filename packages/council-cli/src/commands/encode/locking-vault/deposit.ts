import { LockingVault } from "@council/artifacts/LockingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for LockingVault.deposit",

  options: {
    account: {
      alias: ["funded-account"],
      description: "The address to credit this deposit to",
      type: "string",
      required: true,
    },
    amount: {
      description: "The amount of tokens to deposit",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    delegate: {
      alias: ["first-delegate"],
      description:
        "The address to delegate the resulting voting power to if the account doesn't already have a delegate",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const account = await options.account({
      prompt: "Enter account address",
    });

    const amount = await options.amount({
      prompt: "Enter amount to deposit",
    });

    const decimals = await options.decimals();

    const delegate = await options.delegate({
      prompt: "Enter first delegate address",
    });

    const encoded = encodeDeposit(account, amount, decimals, delegate);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeDeposit(
  account: string,
  amount: string,
  decimals: number,
  delegate: string,
): string {
  return encodeFunctionData({
    abi: LockingVault.abi,
    functionName: "deposit",
    args: [
      account as `0x${string}`,
      parseUnits(amount, decimals),
      delegate as `0x${string}`,
    ],
  });
}
