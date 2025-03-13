#!/usr/bin/env node
import { help, run } from "clide-js";
import { commandMenu } from "clide-plugin-command-menu";
import "dotenv/config";

run({
  plugins: [
    // Help generator with --help and -h options
    help({
      maxWidth: 100,
    }),

    // Interactive prompts for incomplete commands
    commandMenu({
      title: "Council CLI",
      titleColors: ["#D89DFF", "#519BFF"],
      enabled: (options) => !options.help,
    }),
  ],

  // Top level options applied to all commands
  options: {
    y: {
      alias: ["yes"],
      description: "Accept all default option values",
      type: "boolean",
      default: false,
    },
  },

  afterParse: async ({ parsedOptions, context, setParsedOptions }) => {
    const newOptions = { ...parsedOptions };
    for (const [key, config] of Object.entries(context.options)) {
      // Set defaults if --yes is passed
      if (parsedOptions.yes) (newOptions[key] as any) ??= config.default;

      setParsedOptions(newOptions);
    }
  },
})
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
