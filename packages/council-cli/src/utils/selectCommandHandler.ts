import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import signale from "signale";
import { CommandModule } from "yargs";

interface selectCommandHandlerOptions {
  commandsPath: string;
  extensions: string[];
  message?: string;
}

export function selectCommandHandler({
  commandsPath,
  extensions,
  message = "Choose a command",
}: selectCommandHandlerOptions): CommandModule["handler"] {
  return async (argv) => {
    const commandDirItems = fs.readdirSync(commandsPath);

    const extensionStrings = extensions.map((extension) => `.${extension}`);
    const extensionRegex = new RegExp(`(${extensionStrings.join("|")})$`);

    const command = await prompts({
      type: "select",
      name: "filename",
      message,
      choices: commandDirItems
        .filter((item) => extensionRegex.test(item))
        .map((filename) => {
          return {
            title: filename.replace(/\.\w+$/, ""),
            value: filename,
          };
        }),
    });

    try {
      const filePath = path.join(commandsPath, command.filename);
      const { handler } = await import(filePath);
      return handler(argv);
    } catch (err) {
      signale.error(err);
    }
  };
}
