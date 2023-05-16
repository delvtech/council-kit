import { Authorizable__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-owner [OPTIONS]",
    aliases: ["setOwner"],
    describe: "Encode call data for Authorizable.setOwner",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["address", "who"],
          describe: "The address to set as the owner",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const address = await requiredString(args.address, {
        name: "address",
        message: "Enter owner address",
      });

      signale.success(encodeSetOwner(address));
    },
  });

export function encodeSetOwner(address: string): string {
  const authorizableInterface = new Interface(Authorizable__factory.abi);
  return authorizableInterface.encodeFunctionData("setOwner", [address]);
}
