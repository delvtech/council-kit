import { VestingVault__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "update-voting-power [OPTIONS]",
    aliases: ["updateVotingPower"],
    describe: "Encode call data for VestingVault.updateVotingPower",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["address", "who"],
          describe: "The address to update voting power for",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const who = await requiredString(args.who, {
        name: "who",
        message: "Enter voter's address",
      });

      signale.success(encodeUpdateVotingPower(who));
    },
  });

export function encodeUpdateVotingPower(who: string): string {
  const lockingVaultInterface = new Interface(VestingVault__factory.abi);
  return lockingVaultInterface.encodeFunctionData("updateVotingPower", [who]);
}
