import { LockingVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, describe, builder, handler } = createCommandModule({
  command: "deposit [OPTIONS]",
  describe: "Encode call data for LockingVault.deposit",

  builder: (yargs) => {
    return yargs.options({
      f: {
        alias: ["account", "funded-account", "fundedAccount"],
        describe: "The address to credit this deposit to",
        type: "string",
      },
      a: {
        alias: ["amount"],
        describe: "The amount of tokens to deposit",
        type: "string",
      },
      p: {
        alias: ["decimals"],
        describe:
          "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
        type: "number",
      },
      d: {
        alias: ["delegate", "first-delegate", "firstDelegate"],
        describe:
          "The address to delegate the resulting voting power to if the account doesn't already have a delegate",
        type: "string",
      },
    });
  },

  handler: async (args) => {
    const account = await requiredString(args.account, {
      name: "account",
      message: "Enter account address",
    });

    const amount = await requiredString(args.amount, {
      name: "amount",
      message: "Enter amount to deposit",
    });

    const decimals = await requiredNumber(args.decimals, {
      name: "decimals",
      message: "Enter decimal precision",
      initial: 18,
    });

    const delegate = await requiredString(args.delegate, {
      name: "delegate",
      message: "Enter first delegate address",
    });

    signale.success(encodeDeposit(account, amount, decimals, delegate));
  },
});

export function encodeDeposit(
  account: string,
  amount: string,
  decimals: number,
  delegate: string,
): string {
  return encodeFunctionData({
    abi: LockingVault__factory.abi,
    functionName: "deposit",
    args: [account, parseBigInt(amount, decimals), delegate],
  });
}
