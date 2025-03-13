import { command } from "clide-js";
import signale from "signale";
import { config, settings } from "../../config.js";

export default command({
  description: "Set a configuration value",
  options: {
    s: {
      alias: ["setting"],
      type: "string",
      customType: "setting",
      description: "The setting to change.",
      required: true,
      choices: settings,
    },
    v: {
      alias: ["value"],
      type: "string",
      description: "The new value for the setting.",
      required: true,
    },
  },
  handler: async ({ options, next }) => {
    const [setting, value] = await Promise.all([
      options.setting(),
      options.value(),
    ]);
    config.set(setting, value);
    signale.success(`${setting} set to ${value}`);
    const newData = { [setting]: value };
    console.table(newData);
    next(newData);
  },
});
