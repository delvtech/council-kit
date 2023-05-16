import { Spender__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "medium-spend [OPTIONS]",
    aliases: ["mediumSpend"],
    describe: "Encode call data for a Spender.mediumSpend",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["amount"],
          describe: "The amount to spend",
          type: "string",
        },
        p: {
          alias: ["decimals"],
          describe:
            "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
        d: {
          alias: ["destination"],
          describe: "The address to send the funds to",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const amount = await requiredString(args.amount, {
        name: "amount",
        message: "Enter amount to spend",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      const destination = await requiredString(args.destination, {
        name: "destination",
        message: "Enter destination address",
      });

      signale.success(encodeMediumSpend(amount, decimals, destination));
    },
  });

export function encodeMediumSpend(
  amount: string,
  decimals: number,
  destination: string,
): string {
  return encodeFunctionData({
    abi: Spender__factory.abi,
    functionName: "mediumSpend",
    args: [parseBigInt(amount, decimals), destination],
  });
}
