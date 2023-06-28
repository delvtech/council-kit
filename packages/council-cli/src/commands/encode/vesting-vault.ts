import path from "node:path";
import { createCommandModule } from "src/utils/createCommandModule";
import {
  COMMAND_FILE_EXTENSIONS,
  selectCommandHandler,
} from "src/utils/selectCommandHandler";

const commandDir = "./vesting-vault";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "vesting-vault [function]",
    aliases: ["VestingVault"],
    describe: "Encode call data for a VestingVault function",

    builder: (yargs) => {
      return yargs.commandDir(commandDir, {
        extensions: COMMAND_FILE_EXTENSIONS,
      });
    },

    handler: selectCommandHandler({
      commandsPath: path.resolve(__dirname, commandDir),
      message: "Choose a function",
    }),
  });
