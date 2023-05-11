import { GSCVault__factory } from "@council/typechain";
import { Interface, parseUnits } from "ethers/lib/utils";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredNumberString } from "src/options/utils/requiredNumberString";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, builder, handler } = createCommandModule({
  command: "set-vote-power-bound [OPTIONS]",
  aliases: ["setVotePowerBound"],

  builder: (yargs) => {
    return yargs.options({
      p: {
        alias: ["power", "new-bound", "newBound"],
        describe: "The new required voting power to become a member",
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
      message: "Enter new voting power bound",
    });

    const decimals = await requiredNumber(args.decimals, {
      name: "decimals",
      message: "Enter decimal precision",
      initial: 18,
    });

    signale.success(encodeSetVotePowerBounc(power, decimals));
  },
});

export function encodeSetVotePowerBounc(power: string, decimals = 0): string {
  const gscVaultInterface = new Interface(GSCVault__factory.abi);
  return gscVaultInterface.encodeFunctionData("setVotePowerBound", [
    parseUnits(power, decimals),
  ]);
}
