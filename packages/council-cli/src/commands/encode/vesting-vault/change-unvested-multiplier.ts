import { VestingVault__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";

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
  const lockingVaultInterface = new Interface(VestingVault__factory.abi);
  return lockingVaultInterface.encodeFunctionData("changeUnvestedMultiplier", [
    multiplier,
  ]);
}
