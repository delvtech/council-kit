import { GSCVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-core-voting [OPTIONS]",
    aliases: ["setCoreVoting"],
    describe: "Encode call data for GSCVault.setCoreVoting",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["address", "new-voting", "newVoting"],
          describe: "The new core voting contract address",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const address = await requiredString(args.address, {
        name: "address",
        message: "Enter core voting address",
      });

      signale.success(encodeSetCoreVoting(address));
    },
  });

export function encodeSetCoreVoting(address: string): string {
  return encodeFunctionData({
    abi: GSCVault__factory.abi,
    functionName: "setCoreVoting",
    args: [address],
  });
}
