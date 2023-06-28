import { OptimisticGrants__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, describe, builder, handler } = createCommandModule({
  command: "deposit [OPTIONS]",
  describe: "Encode call data for OptimisticGrants.deposit",

  builder: (yargs) => {
    return yargs.options({
      a: {
        alias: ["amount"],
        describe: "The amount of tokens to deposit",
        type: "string",
      },
      d: {
        alias: ["decimals"],
        describe:
          "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
        type: "number",
      },
    });
  },

  handler: async (args) => {
    const amount = await requiredString(args.amount, {
      name: "amount",
      message: "Enter amount to deposit",
    });

    const decimals = await requiredNumber(args.decimals, {
      name: "decimals",
      message: "Enter decimal precision",
      initial: 18,
    });

    signale.success(encodeDeposit(amount, decimals));
  },
});

export function encodeDeposit(amount: string, decimals: number): string {
  return encodeFunctionData({
    abi: OptimisticGrants__factory.abi,
    functionName: "deposit",
    args: [parseBigInt(amount, decimals)],
  });
}
