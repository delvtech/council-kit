import { Treasury__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

const ETH_CONSTANT = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "send-funds [OPTIONS]",
    aliases: ["sendFunds"],
    describe: "Encode call data for Treasury.sendFunds",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["token"],
          describe: `The address of token to send (${ETH_CONSTANT} to send ETH)`,
          type: "string",
        },
        a: {
          alias: ["amount"],
          describe: "The amount to send",
          type: "string",
        },
        d: {
          alias: ["decimals"],
          describe:
            "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
        r: {
          alias: ["recipient"],
          describe: "The address to send the funds to",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const token = await requiredString(args.token, {
        name: "token",
        message: "Enter token address",
        initial: ETH_CONSTANT,
      });

      const amount = await requiredString(args.amount, {
        name: "amount",
        message: "Enter amount to send",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      const recipient = await requiredString(args.recipient, {
        name: "recipient",
        message: "Enter recipient address",
      });

      signale.success(encodeSendFunds(token, amount, decimals, recipient));
    },
  });

export function encodeSendFunds(
  token: string,
  amount: string,
  decimals: number,
  recipient: string,
): string {
  return encodeFunctionData({
    abi: Treasury__factory.abi,
    functionName: "sendFunds",
    args: [token, parseBigInt(amount, decimals), recipient],
  });
}
