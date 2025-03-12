import { command } from "clide-js";
import signale from "signale";
import { CouncilCliConfig, config } from "../../config.js";

export default command({
  description: "Get a setting",
  options: {
    s: {
      alias: ["setting"],
      type: "string",
      description: "The setting to change",
      required: true,
      choices: Object.keys(config.schema || {}),
    },
  },
  handler: async ({ options, next }) => {
    const setting = await options.setting();
    const value = config.get(setting as keyof CouncilCliConfig);
    signale.info(value);
    next(value);
  },
});
