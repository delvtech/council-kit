import { command } from "clide-js";
import signale from "signale";
import { config } from "../../config.js";

export default command({
  description: "Reset all settings to default",
  options: {
    y: {
      alias: ["yes"],
      description: "Confirm the reset without a prompt.",
      type: "boolean",
      default: true,
    },
  },
  handler: async ({ options, next }) => {
    const confirmed = await options.yes({
      prompt: "Reset all settings to default?",
    });
    if (confirmed) {
      config.reset();
      signale.success("All settings reset to default");
      console.table(config.data());
    }
    next(config.data());
  },
});
