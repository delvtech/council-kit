import { command } from "clide-js";
import { config, CouncilCliConfig } from "../../config.js";

export default command({
  description: "Set a configuration value",
  options: {
    s: {
      alias: ["setting"],
      type: "string",
      description: "The setting to change",
      required: true,
      choices: Object.keys(config.schema || {}),
    },
    v: {
      alias: ["value"],
      type: "string",
      description: "The value to change the setting to",
      required: true,
    },
  },
  handler: async ({ options }) => {
    const [setting, value] = await Promise.all([
      options.setting(),
      options.value(),
    ]);
    config.set(setting as keyof CouncilCliConfig, value);
  },
});
