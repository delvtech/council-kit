import { Timelock__factory } from "@council/typechain";
import signale from "signale";
import { requiredCallHash } from "src/options/utils/requiredCallHash";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "increase-time [OPTIONS]",
    aliases: ["increaseTime"],
    describe: "Encode call data for Timelock.increaseTime",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["time"],
          describe: "The amount of time (in seconds) to increase by",
          type: "number",
        },
        h: {
          alias: ["call-hash", "callHash"],
          describe: "The hash entry to increase time for",
          type: "string",
        },
        a: {
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
      const timeValue = await requiredNumber(args.time, {
        name: "time",
        message: "Enter amount of time (in seconds) to increase by",
      });

      const callHash = await requiredCallHash(
        args.callHash,
        args.targets,
        args.calldatas,
      );

      signale.success(encodeIncreaseTime(timeValue.toString(), callHash));
    },
  });

export function encodeIncreaseTime(
  timeValue: string,
  callHash: string,
): string {
  return encodeFunctionData({
    abi: Timelock__factory.abi,
    functionName: "increaseTime",
    args: [timeValue, callHash],
  });
}
