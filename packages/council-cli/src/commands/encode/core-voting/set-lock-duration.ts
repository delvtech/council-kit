import { CoreVoting__factory } from "@council/typechain";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "set-lock-duration [OPTIONS]",
    aliases: ["setLockDuration"],
    describe: "Encode call data for CoreVoting.setLockDuration",

    builder: (yargs) => {
      return yargs.options({
        b: {
          alias: ["blocks", "lock-duration", "lockDuration"],
          describe:
            "The number of blocks that must pass before a new proposal can be executed",
          type: "number",
        },
      });
    },

    handler: async (args) => {
      const blocks = await requiredNumber(args.blocks, {
        name: "blocks",
        message: "Enter new lock duration (in blocks)",
      });

      signale.success(encodeSetLockDuration(blocks));
    },
  });

export function encodeSetLockDuration(duration: number): string {
  return encodeFunctionData({
    abi: CoreVoting__factory.abi,
    functionName: "setLockDuration",
    args: [duration],
  });
}
