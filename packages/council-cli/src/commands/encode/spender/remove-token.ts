import { Spender__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "remove-token [OPTIONS]",
    aliases: ["removeToken"],
    describe: "Encode call data for a Spender.removeToken",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["amount"],
          describe:
            "The amount of tokens to remove (max uint256 for the full balance)",
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
        message: "Enter amount to remove (max uint256 for the full balance)",
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

      signale.success(encodeRemoveToken(amount, decimals, destination));
    },
  });

export function encodeRemoveToken(
  amount: string,
  decimals: number,
  destination: string,
): string {
  return encodeFunctionData({
    abi: Spender__factory.abi,
    functionName: "removeToken",
    args: [parseBigInt(amount, decimals), destination],
  });
}
