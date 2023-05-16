import { CoreVoting__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredNumberString } from "src/options/utils/requiredNumberString";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-custom-quorum [OPTIONS]",
    aliases: ["setCustomQuorum"],
    describe: "Encode call data for CoreVoting.setCustomQuorum",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["target"],
          describe: "The address to set a custom quorum for",
          type: "string",
        },
        f: {
          alias: ["function", "selector"],
          describe: "The function selector/name",
          type: "string",
        },
        p: {
          alias: ["power", "quorum"],
          describe: "A new base quorum for the specific function",
          type: "string",
        },
        d: {
          alias: ["decimals"],
          describe:
            "The decimal precision used by the contract. The power option will be multiplied by (10 ** decimals). For example, if power is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
      });
    },

    handler: async (args) => {
      const target = await requiredString(args.target, {
        name: "target",
        message: "Enter target address",
      });

      const selector = await requiredString(args.function, {
        name: "function",
        message: "Enter function selector/name",
      });

      const power = await requiredNumberString(args.power, {
        name: "power",
        message: "Enter new base quorum",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      signale.success(encodeSetCustomQuorum(target, selector, power, decimals));
    },
  });

export function encodeSetCustomQuorum(
  target: string,
  selector: string,
  quorum: string,
  decimals: number,
): string {
  return encodeFunctionData({
    abi: CoreVoting__factory.abi,
    functionName: "setCustomQuorum",
    args: [target, selector, parseBigInt(quorum, decimals)],
  });
}
