import { command } from "clide-js";
import signale from "signale";
import { config } from "../../config.js";

export default command({
  description: "Remove the configuration file",
  options: {
    y: {
      alias: ["yes"],
      description: "Confirm the removal without a prompt.",
      type: "boolean",
      default: true,
    },
  },
  handler: async ({ options, next }) => {
    const confirmed = await options.yes({
      prompt: "Delete the configuration file?",
    });
    if (confirmed) {
      config.rm();
      signale.success("Configuration file removed");
    }
    next(confirmed);
  },
});
