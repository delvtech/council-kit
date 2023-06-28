#!/usr/bin/env node
import path from "node:path";
import signale from "signale";
import "src/utils/fetchPolyfill";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  COMMAND_FILE_EXTENSIONS,
  selectCommandHandler,
} from "./utils/selectCommandHandler";

const commandDir = "./commands";

const parser = yargs(hideBin(process.argv))
  .commandDir(commandDir, {
    extensions: COMMAND_FILE_EXTENSIONS,
  })
  .command(
    "$0",
    "Start a guided walkthrough",
    () => {},
    selectCommandHandler({
      commandsPath: path.resolve(__dirname, commandDir),
      message: `What would you like to do?`,
      isRoot: true,
    }),
  )
  // turn off yargs error handling
  .fail(false);

async function main() {
  try {
    await parser.parse();
  } catch (err) {
    const help = await parser.getHelp();
    signale.error(`${err}\n\n${help}`);
  }
}

main();
