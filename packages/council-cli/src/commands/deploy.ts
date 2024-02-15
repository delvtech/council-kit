import { command } from "clide-js";
import {
  getWriteOptions,
  writeOptions,
} from "../reusable-options/writeOptions.js";

export default command({
  description: "Deploy a contract or combination of contracts",
  requiresSubcommand: true,
  options: writeOptions,
  handler: async ({ options, context, next }) => {
    return next(await getWriteOptions(options, context));
  },
});
