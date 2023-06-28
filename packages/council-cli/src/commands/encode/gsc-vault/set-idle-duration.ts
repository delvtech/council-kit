import { GSCVault__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-idle-duration [OPTIONS]",
    aliases: ["setIdleDuration"],
    describe: "Encode call data for GSCVault.setIdleDuration",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["time", "idle-duration", "idleDuration"],
          describe:
            "The time (in seconds) new members must wait before they can vote",
          type: "number",
        },
      });
    },

    handler: async (args) => {
      const time = await requiredNumber(args.time, {
        name: "time",
        message: "Enter new idle time (in seconds)",
      });

      signale.success(encodeSetIdleDuration(time));
    },
  });

export function encodeSetIdleDuration(time: number): string {
  return encodeFunctionData({
    abi: GSCVault__factory.abi,
    functionName: "setIdleDuration",
    args: [time],
  });
}
