import path from "node:path";
import { createCommandModule } from "src/utils/createCommandModule";
import {
  COMMAND_FILE_EXTENSIONS,
  selectCommandHandler,
} from "src/utils/selectCommandHandler";

const commandDir = "./core-voting";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "core-voting [function]",
    aliases: ["CoreVoting"],
    describe: "Encode call data for a CoreVoting function",

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
