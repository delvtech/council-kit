import { VestingVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "initialize [OPTIONS]",
    describe: "Encode call data for VestingVault.initialize",

    builder: (yargs) => {
      return yargs.options({
        m: {
          alias: ["manager"],
          describe: "The address that will be able add and remove grants",
          type: "string",
        },
        t: {
          alias: ["timelock"],
          describe:
            "The address that will be able to change the unvested multiplier, the manager, and the timelock",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const manager = await requiredString(args.manager, {
        name: "manager",
        message: "Enter manager address",
      });

      const timelock = await requiredString(args.timelock, {
        name: "timelock",
        message: "Enter timelock address",
      });

      signale.success(encodeInitialize(manager, timelock));
    },
  });

export function encodeInitialize(manager: string, timelock: string): string {
  return encodeFunctionData({
    abi: VestingVault__factory.abi,
    functionName: "initialize",
    args: [manager, timelock],
  });
}
