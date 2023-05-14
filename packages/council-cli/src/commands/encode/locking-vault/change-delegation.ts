import { LockingVault__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "change-delegation [OPTIONS]",
    aliases: ["changeDelegation"],
    describe: "Encode call data for LockingVault.changeDelegation",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["address", "new-delegate", "newDelegate"],
          describe: "The amount of tokens to deposit",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const address = await requiredString(args.address, {
        name: "address",
        message: "Enter new delegate address",
      });

      signale.success(encodeChangeDelegation(address));
    },
  });

export function encodeChangeDelegation(address: string): string {
  const lockingVaultInterface = new Interface(LockingVault__factory.abi);
  return lockingVaultInterface.encodeFunctionData("changeDelegation", [
    address,
  ]);
}
