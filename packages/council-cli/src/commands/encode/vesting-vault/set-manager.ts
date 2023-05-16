import { VestingVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-manager [OPTIONS]",
    aliases: ["setTimelock"],
    describe: "Encode call data for VestingVault.setManager",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["address", "manager"],
          describe: "The new manager address",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const address = await requiredString(args.address, {
        name: "address",
        message: "Enter new manager address",
      });

      signale.success(encodeSetManager(address));
    },
  });

export function encodeSetManager(address: string): string {
  return encodeFunctionData({
    abi: VestingVault__factory.abi,
    functionName: "setManager",
    args: [address],
  });
}
