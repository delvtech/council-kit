import { CoreVoting__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredNumberString } from "src/options/utils/requiredNumberString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-min-proposal-power [OPTIONS]",
    aliases: ["setMinProposalPower"],
    describe: "Encode call data for CoreVoting.setMinProposalPower",

    builder: (yargs) => {
      return yargs.options({
        p: {
          alias: ["power", "min-proposal-power", "minProposalPower"],
          describe: "The minimum voting power required to create a proposal",
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
      const power = await requiredNumberString(args.power, {
        name: "power",
        message: "Enter minimum voting power",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      signale.success(encodeSetMinProposalPower(power, decimals));
    },
  });

export function encodeSetMinProposalPower(
  power: string,
  decimals: number,
): string {
  return encodeFunctionData({
    abi: CoreVoting__factory.abi,
    functionName: "setMinProposalPower",
    args: [parseBigInt(power, decimals)],
  });
}
