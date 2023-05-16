import { Timelock__factory } from "@council/typechain";
import signale from "signale";
import { requiredCallHash } from "src/options/utils/requiredCallHash";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

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

      signale.success(encodeStopCall(callHash));
    },
  });

export function encodeStopCall(callHash: string): string {
  return encodeFunctionData({
    abi: Timelock__factory.abi,
    functionName: "stopCall",
    args: [callHash],
  });
}
