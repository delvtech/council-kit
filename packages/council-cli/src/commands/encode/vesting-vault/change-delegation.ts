import { VestingVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "change-delegation [OPTIONS]",
    aliases: ["changeDelegation"],
    describe: "Encode call data for VestingVault.changeDelegation",

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
  return encodeFunctionData({
    abi: VestingVault__factory.abi,
    functionName: "changeDelegation",
    args: [address],
  });
}
