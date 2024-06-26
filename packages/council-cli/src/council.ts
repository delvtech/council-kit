#!/usr/bin/env node
import { help, run } from "clide-js";
import { commandMenu } from "clide-plugin-command-menu";
import "dotenv/config";
import signale from "signale";

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

  afterParse: async ({ parsedOptions, context }) => {
    if (parsedOptions.yes) {
      for (const [key, config] of Object.entries(context.options)) {
        (parsedOptions[key] as any) = parsedOptions[key] ?? config.default;
      }
    }
  },
}).catch((error) => {
  signale.error(error);
});
