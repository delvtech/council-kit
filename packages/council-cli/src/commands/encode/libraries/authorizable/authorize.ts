import { Authorizable__factory } from "@council/typechain";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, describe, builder, handler } = createCommandModule({
  command: "authorize [OPTIONS]",
  describe: "Encode call data for Authorizable.authorize",

  builder: (yargs) => {
    return yargs.options({
      a: {
        alias: ["address", "who"],
        describe: "The address to authorize",
        type: "string",
      },
    });
  },

  handler: async (args) => {
    const address = await requiredString(args.address, {
      name: "address",
      message: "Enter address",
    });

    signale.success(encodeAuthorize(address));
  },
});

export function encodeAuthorize(address: string): string {
  return encodeFunctionData({
    abi: Authorizable__factory.abi,
    functionName: "authorize",
    args: [address],
  });
}
