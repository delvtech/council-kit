import { VestingVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "change-unvested-multiplier [OPTIONS]",
    aliases: ["changeUnvestedMultiplier"],
    describe: "Encode call data for VestingVault.changeUnvestedMultiplier",

    builder: (yargs) => {
      return yargs.options({
        m: {
          alias: ["multiplier"],
          describe: "The new multiplier as a percentage",
          type: "number",
        },
      });
    },

    handler: async (args) => {
      const multiplier = await requiredNumber(args.multiplier, {
        name: "multiplier",
        message: "Enter new multiplier (%)",
      });

      signale.success(encodeChangeUnvestedMultiplier(multiplier));
    },
  });

export function encodeChangeUnvestedMultiplier(multiplier: number): string {
  return encodeFunctionData({
    abi: VestingVault__factory.abi,
    functionName: "changeUnvestedMultiplier",
    args: [multiplier],
  });
}
