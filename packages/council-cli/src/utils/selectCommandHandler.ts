import cfonts from "cfonts";
import colors from "colors";
import fs from "node:fs";
import path from "node:path";
import prompts, { Choice } from "prompts";
import signale from "signale";
import { CommandModule } from "yargs";

export const COMMAND_FILE_EXTENSIONS = ["js", "ts"];

export interface selectCommandHandlerOptions {
  /**
   * The path to the directory to scan for command modules. The names of the
   * files will be used to populate the choices for the user.
   */
  commandsPath: string;

  /**
   * The message to show when prompting the user to select a command.
   * @default "Choose a command"
   */
  message?: string;

  /**
   * Set to false to prevent showing the command module's `describe` export in
   * the choices.
   * @default true
   */
  showDescriptions?: boolean;

  /**
   * The max character length of the description. If the description goes past
   * this, it will be truncated with an ellipses.
   * @default 60
   */
  maxDescriptionLength?: number;

  /**
   * Set to true to remove the back option
   * @default false;
   */
  isRoot?: boolean;
}

/**
 * Create a command module handler that prompts the user to select a command
 * from all files at a given path.
 * @returns
 */
export function selectCommandHandler(
  options: selectCommandHandlerOptions,
): CommandModule["handler"] {
  return async (argv) => {
    try {
      const commandName = argv._.slice(-1)[0];

      const {
        commandsPath,
        message = "Choose a command",
        showDescriptions = true,
        maxDescriptionLength = 60,
        isRoot = path.basename(commandsPath) === commandName,
      } = options;

      const commandDirItems = fs.readdirSync(commandsPath);
      const extensionStrings = COMMAND_FILE_EXTENSIONS.map(
        (extension) => `\\.${extension}`,
      );
      const extensionRegex = new RegExp(`(${extensionStrings.join("|")})$`);

      const choices = await Promise.all(
        commandDirItems
          .filter((item) => {
            const isCommand = extensionRegex.test(item);
            return isCommand;
          })
          .map(async (filename): Promise<Choice> => {
            const title = removeFileExtension(filename);
            let description;

            if (showDescriptions) {
              const filepath = path.join(commandsPath, filename);
              const { describe } = (await import(
                filepath
              ).catch()) as CommandModule;

              description =
                describe && describe.length > maxDescriptionLength
                  ? `${describe.slice(0, maxDescriptionLength)}...`
                  : describe;
            }

            return {
              title: `${title}${
                description ? colors.dim(` - ${description}`) : ""
              }`,
              value: filename,
            };
          }),
      );

      const backChoice = {
        title: colors.italic("↩ back"),
        value: "back",
      };

      if (!isRoot) {
        choices.unshift(backChoice);
      }

      if (!hasIntroduced) {
        cfonts.say("Council CLI", {
          font: "tiny",
          gradient: ["#D89DFF", "#519BFF"],
          transitionGradient: true,
        });
        hasIntroduced = true;
      }

      const { filename } = await prompts(
        {
          type: "select",
          name: "filename",
          message,
          choices,
        },
        {
          onCancel: () => {
            process.exit();
          },
        },
      );

      if (filename === backChoice.value) {
        const handler = handlerHistory.pop();
        return handler?.(argv);
      }
      handlerHistory.push(selectCommandHandler(options));

      const filePath = path.join(commandsPath, filename);
      const { handler } = await import(filePath);

      try {
        return await handler(argv);
      } catch (err) {
        signale.error(err);

        // replay if selected handler fails
        const handler = handlerHistory.pop();
        return handler?.(argv);
      }
    } catch (err) {
      signale.error(err);
    }
  };
}

function removeFileExtension(filename: string): string {
  return filename.replace(/\.\w+$/, "");
}

let hasIntroduced = false;

const handlerHistory: CommandModule["handler"][] = [];
