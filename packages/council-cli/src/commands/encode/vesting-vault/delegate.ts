import { VestingVault__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "delegate [OPTIONS]",
    describe: "Encode call data for VestingVault.delegate",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["address", "to"],
          describe: "The address to delegate to",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const address = await requiredString(args.address, {
        name: "to",
        message: "Enter new delegate address",
      });

      signale.success(encodeDelegate(address));
    },
  });

export function encodeDelegate(address: string): string {
  const lockingVaultInterface = new Interface(VestingVault__factory.abi);
  return lockingVaultInterface.encodeFunctionData("delegate", [address]);
}
