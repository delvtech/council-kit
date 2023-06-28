import { VestingVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-timelock [OPTIONS]",
    aliases: ["setTimelock"],
    describe: "Encode call data for VestingVault.setTimelock",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["address", "timelock"],
          describe: "The new timelock address",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const address = await requiredString(args.address, {
        name: "address",
        message: "Enter new timelock address",
      });

      signale.success(encodeSetTimelock(address));
    },
  });

export function encodeSetTimelock(address: string): string {
  return encodeFunctionData({
    abi: VestingVault__factory.abi,
    functionName: "setTimelock",
    args: [address],
  });
}
