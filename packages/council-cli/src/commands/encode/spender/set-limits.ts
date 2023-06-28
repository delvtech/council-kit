import { Spender__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-limits [OPTIONS]",
    aliases: ["setLimits"],
    describe: "Encode call data for a Spender.setLimits",

    builder: (yargs) => {
      return yargs.options({
        s: {
          alias: ["small"],
          describe: "The new small spend limit",
          type: "string",
        },
        m: {
          alias: ["medium"],
          describe: "The new medium spend limit",
          type: "string",
        },
        h: {
          alias: ["high"],
          describe: "The new high spend limit",
          type: "string",
        },
        d: {
          alias: ["decimals"],
          describe:
            "The decimal precision used by the contract. The amount options will be multiplied by (10 ** decimals). For example, if small is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
      });
    },

    handler: async (args) => {
      const small = await requiredString(args.small, {
        name: "small",
        message: "Enter small spend limit",
      });

      const medium = await requiredString(args.medium, {
        name: "medium",
        message: "Enter medium spend limit",
      });

      const high = await requiredString(args.high, {
        name: "high",
        message: "Enter high spend limit",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      signale.success(encodeSetLimits(small, medium, high, decimals));
    },
  });

export function encodeSetLimits(
  small: string,
  medium: string,
  high: string,
  decimals: number,
): string {
  return encodeFunctionData({
    abi: Spender__factory.abi,
    functionName: "setLimits",
    args: [
      [
        parseBigInt(small, decimals),
        parseBigInt(medium, decimals),
        parseBigInt(high, decimals),
      ],
    ],
  });
}
