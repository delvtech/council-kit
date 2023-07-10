import path from "node:path";
import { createCommandModule } from "src/utils/createCommandModule";
import {
  COMMAND_FILE_EXTENSIONS,
  selectCommandHandler,
} from "src/utils/selectCommandHandler";

const commandDir = "./merkle-rewards";

export const { command, describe, builder, handler } = createCommandModule({
  command: "merkle-rewards [command]",
  describe: "Do something for merkle rewards, like create a tree with proofs.",

  builder: (yargs) => {
    return yargs.commandDir(commandDir, {
      extensions: COMMAND_FILE_EXTENSIONS,
    });
  },

  handler: selectCommandHandler({
    commandsPath: path.resolve(__dirname, commandDir),
  }),
});
