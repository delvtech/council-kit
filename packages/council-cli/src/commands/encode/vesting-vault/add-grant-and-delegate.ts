import { VestingVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "add-grant-and-delegate [OPTIONS]",
    aliases: ["addGrantAndDelegate"],
    describe: "Encode call data for VestingVault.addGrantAndDelegate",

    builder: (yargs) => {
      return yargs.options({
        w: {
          alias: ["who", "address"],
          describe: "The grant recipient",
          type: "string",
        },
        a: {
          alias: ["amount"],
          describe: "The total grant value",
          type: "string",
        },
        p: {
          alias: ["decimals"],
          describe:
            "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
        s: {
          alias: ["start-time", "startTime"],
          describe:
            "An optional non standard start time (in seconds). If set to zero then the start time will be made the block this is executed in",
          type: "number",
          default: 0,
        },
        e: {
          alias: ["expiration"],
          describe:
            "The timestamp (in seconds) when the grant ends and all tokens are unlocked",
          type: "number",
        },
        c: {
          alias: ["cliff"],
          describe:
            "The timestamp (in seconds) when the grant begins vesting. No tokens will be unlocked until this timestamp has been reached",
          type: "number",
        },
        d: {
          alias: ["delegate"],
          describe:
            "The address to delegate the resulting voting power to if the recipient doesn't already have a delegate",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const who = await requiredString(args.who, {
        name: "who",
        message: "Enter recipient address",
      });

      const amount = await requiredString(args.amount, {
        name: "amount",
        message: "Enter total grant amount",
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

      const cliff = await requiredNumber(args.cliff, {
        name: "cliff",
        message: "Enter cliff timestamp (in seconds)",
      });

      const delegate = await requiredString(args.delegate, {
        name: "delegate",
        message: "Enter delegate address",
      });

      signale.success(
        encodeAddGrantAndDelegate({
          who,
          amount,
          decimals,
          startTime: args.startTime,
          expiration,
          cliff,
          delegate,
        }),
      );
    },
  });

interface EncodeAddGrantAndDelegateOptions {
  who: string;
  amount: string;
  decimals: number;
  expiration: number;
  cliff: number;
  delegate: string;
  startTime?: number;
}

export function encodeAddGrantAndDelegate({
  who,
  amount,
  decimals,
  startTime = 0,
  expiration,
  cliff,
  delegate,
}: EncodeAddGrantAndDelegateOptions): string {
  return encodeFunctionData({
    abi: VestingVault__factory.abi,
    functionName: "addGrantAndDelegate",
    args: [
      who,
      parseBigInt(amount, decimals),
      startTime,
      expiration,
      cliff,
      delegate,
    ],
  });
}
