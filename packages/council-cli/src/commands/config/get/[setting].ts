import { command } from "clide-js";
import signale from "signale";
import { CouncilCliConfig, config } from "../../../config.js";

export default command({
  description: "Get a setting",
  handler: ({ params, next }) => {
    const { setting } = params as {
      setting: keyof CouncilCliConfig;
    };
    const value = config.get(setting as keyof CouncilCliConfig);
    signale.info(value);
    next(value);
  },
});
