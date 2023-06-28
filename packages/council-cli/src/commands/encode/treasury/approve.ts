import { Treasury__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "approve [OPTIONS]",
    describe: "Encode call data for Treasury.approve",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["token"],
          describe: `The address of the token to approve`,
          type: "string",
        },
        a: {
          alias: ["amount"],
          describe: "The amount to approve",
          type: "string",
        },
        d: {
          alias: ["decimals"],
          describe:
            "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
        s: {
          alias: ["spender"],
          describe: "The address to approve",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const token = await requiredString(args.token, {
        name: "token",
        message: "Enter token address",
      });

      const amount = await requiredString(args.amount, {
        name: "amount",
        message: "Enter amount to approve",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      const spender = await requiredString(args.spender, {
        name: "spender",
        message: "Enter spender address",
      });

      signale.success(encodeApprove(token, amount, decimals, spender));
    },
  });

export function encodeApprove(
  token: string,
  amount: string,
  decimals: number,
  spender: string,
): string {
  return encodeFunctionData({
    abi: Treasury__factory.abi,
    functionName: "approve",
    args: [token, parseBigInt(amount, decimals), spender],
  });
}
