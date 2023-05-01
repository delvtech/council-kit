#!/usr/bin/env node
import path from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { selectCommandHandler } from "./utils/selectCommandHandler";

const commandDir = "./commands";
const extensions = ["ts", "js"];

yargs(hideBin(process.argv))
  .commandDir(commandDir, {
    extensions,
  })
  .command(
    "$0",
    "Start a guided walkthrough",
    () => {},
    selectCommandHandler({
      commandsPath: path.resolve(__dirname, commandDir),
      extensions,
      message: "What would you like to do?",
    }),
  )
  .help().argv;
