import { VestingVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "remove-grant [OPTIONS]",
    aliases: ["removeGrant"],
    describe: "Encode call data for VestingVault.removeGrant",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["address", "who"],
          describe: "The grant owner",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const who = await requiredString(args.who, {
        name: "who",
        message: "Enter owner address",
      });

      signale.success(encodeRemoveGrant(who));
    },
  });

export function encodeRemoveGrant(who: string): string {
  return encodeFunctionData({
    abi: VestingVault__factory.abi,
    functionName: "removeGrant",
    args: [who],
  });
}
