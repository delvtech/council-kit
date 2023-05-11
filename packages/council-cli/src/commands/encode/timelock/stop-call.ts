import { Timelock__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredCallHash } from "src/options/utils/requiredCallHash";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "stop-call [OPTIONS]",
    aliases: ["stopCall"],
    describe: "Encode call data for Timelock.stopCall",

    builder: (yargs) => {
      return yargs.options({
        h: {
          alias: ["call-hash", "callHash"],
          describe: "The hash entry to remove",
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
            "Execution call data for each target. This will be used with the `-t | --targets` option to create a call hash if one isn't provided via the `-h | --call-hash` option.",
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

      signale.success(encodeStopCall(callHash));
    },
  });

export function encodeStopCall(callHash: string): string {
  const timelockInterface = new Interface(Timelock__factory.abi);
  return timelockInterface.encodeFunctionData("stopCall", [callHash]);
}
