import { Timelock__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-wait-time [OPTIONS]",
    aliases: ["setWaitTime"],
    describe: "Encode call data for Timelock.setWaitTime",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["time", "wait-time", "waitTime"],
          describe: "The new wait time (in seconds)",
          type: "number",
        },
      });
    },

    handler: async (args) => {
      const time = await requiredNumber(args.time, {
        name: "time",
        message: "Enter new wait time (in seconds)",
      });

      signale.success(encodeSetWaitTime(time.toString()));
    },
  });

export function encodeSetWaitTime(waitTime: string): string {
  const timelockInterface = new Interface(Timelock__factory.abi);
  return timelockInterface.encodeFunctionData("setWaitTime", [waitTime]);
}
