import path from "node:path";
import { selectCommandHandler } from "src/utils/selectCommandHandler";
import { Argv } from "yargs";

const commandDir = "./proposal";
const extensions = ["js", "ts"];

export const command = "proposal [command]";

export const describe = "Interact with a proposal";

export function builder(yargs: Argv): Argv {
  return yargs.commandDir(commandDir, {
    extensions,
  });
}

export const handler = selectCommandHandler({
  commandsPath: path.resolve(__dirname, commandDir),
  extensions,
});
