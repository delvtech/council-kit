import { command } from "clide-js";
import signale from "signale";
import { config, CouncilCliConfig } from "../../config.js";

export default command({
  description: "Delete a setting",
  options: {
    s: {
      alias: ["settings"],
      type: "array",
      description: "The setting to change",
      required: true,
      choices: Object.keys(config.schema || {}),
    },
  },
  handler: async ({ options }) => {
    const settings = await options.settings();
    config.delete(...(settings as (keyof CouncilCliConfig)[]));
    signale.success(`Deleted settings: ${settings.join(", ")}`);
  },
});
