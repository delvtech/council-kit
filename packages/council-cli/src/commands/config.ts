import path from "node:path";
import { selectCommandHandler } from "src/utils/selectCommandHandler";
import { Argv } from "yargs";

const commandDir = "./config";
const extensions = ["js", "ts"];

export const command = "config";

export const describe = "Manage configuration options for the Council CLI.";

export function builder(yargs: Argv): Argv {
  return yargs.commandDir(commandDir, {
    extensions,
  });
}

export const handler = selectCommandHandler({
  commandsPath: path.resolve(__dirname, commandDir),
  extensions,
  message: "Choose a config action",
});
