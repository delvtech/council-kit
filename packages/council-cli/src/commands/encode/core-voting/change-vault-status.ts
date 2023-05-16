import { CoreVoting__factory } from "@council/typechain";
import signale from "signale";
import { requiredBoolean } from "src/options/utils/requiredBoolean";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "change-vault-status [OPTIONS]",
    aliases: ["changeVaultStatus"],
    describe: "Encode call data for CoreVoting.changeVaultStatus",

    builder: (yargs) => {
      return yargs.options({
        v: {
          alias: ["vault"],
          describe: "The voting vault's address",
          type: "string",
        },
        a: {
          alias: ["approved", "is-valid", "isValid"],
          describe: "Whether or not the vault should be approved",
          type: "boolean",
        },
      });
    },

    handler: async (args) => {
      const vault = await requiredString(args.vault, {
        name: "vault",
        message: "Enter voting vault address",
      });

      const approved = await requiredBoolean(args.approved, {
        name: "approved",
        message: "Enter approval status",
        inactive: "Not Approved",
        active: "Approved",
      });

      signale.success(encodeChangeVaultStatus(vault, approved));
    },
  });

export function encodeChangeVaultStatus(
  vault: string,
  approved: boolean,
): string {
  return encodeFunctionData({
    abi: CoreVoting__factory.abi,
    functionName: "changeVaultStatus",
    args: [vault, approved],
  });
}
