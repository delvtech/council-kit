import { command } from "clide-js";
import signale from "signale";
import { config, Config, settings } from "../../config.js";

export default command({
  description: "Delete a setting",
  options: {
    s: {
      alias: ["settings"],
      type: "array",
      description: "The setting to change",
      required: true,
      choices: settings,
    },
  },
  handler: async ({ options }) => {
    const settings = await options.settings();
    config.delete(...(settings as (keyof Config)[]));
    signale.success(`Deleted settings: ${settings.join(", ")}`);
  },
});
