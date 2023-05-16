import { Timelock__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredCallHash } from "src/options/utils/requiredCallHash";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "register-call [OPTIONS]",
    aliases: ["registerCall"],
    describe: "Encode call data for Timelock.registerCall",

    builder: (yargs) => {
      return yargs.options({
        h: {
          alias: ["call-hash", "callHash"],
          describe: "The hash to map the timestamp to",
          type: "string",
        },
        t: {
          alias: ["targets"],
          describe:
            "A list of addresses to call. This will be used with the `-d | --calldatas` option to create a call hash if one isn't provided via the `-h | --call-hash` option.",
          type: "array",
          string: true,
        },
        d: {
          alias: ["calldatas"],
          describe:
            "Encoded call data for each target. This will be used with the `-t | --targets` option to create a call hash if one isn't provided via the `-h | --call-hash` option.",
          type: "array",
          string: true,
        },
      });
    },

    handler: async (args) => {
      const callHash = await requiredCallHash(
        args.callHash,
        args.targets,
        args.calldatas,
      );

      signale.success(encodeRegisterCall(callHash));
    },
  });

export function encodeRegisterCall(callHash: string): string {
  const timelockInterface = new Interface(Timelock__factory.abi);
  return timelockInterface.encodeFunctionData("registerCall", [callHash]);
}
