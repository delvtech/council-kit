import { OptimisticGrants__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "configure-grant [function]",
    aliases: ["configureGrant"],
    describe: "Encode call data for a OptimisticGrants.configureGrant",

    builder: (yargs) => {
      return yargs.options({
        o: {
          alias: ["owner"],
          describe: "The address of the grant owner",
          type: "string",
        },
        a: {
          alias: ["amount"],
          describe: "The amount of tokens to grant",
          type: "string",
        },
        d: {
          alias: ["decimals"],
          describe:
            "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
        e: {
          alias: ["expiration"],
          describe: "The expiration timestamp (in seconds) of the grant",
          type: "number",
        },
      });
    },

    handler: async (args) => {
      const owner = await requiredString(args.owner, {
        name: "owner",
        message: "Enter owner address",
      });

      const amount = await requiredString(args.amount, {
        name: "amount",
        message: "Enter amount to grant",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      const expiration = await requiredNumber(args.expiration, {
        name: "expiration",
        message: "Enter expiration timestamp (in seconds)",
      });

      signale.success(
        encodeConfigureGrant(owner, amount, decimals, expiration),
      );
    },
  });

export function encodeConfigureGrant(
  owner: string,
  amount: string,
  decimals: number,
  expiration: number,
): string {
  return encodeFunctionData({
    abi: OptimisticGrants__factory.abi,
    functionName: "configureGrant",
    args: [owner, parseBigInt(amount, decimals), expiration],
  });
}
