import { command } from "clide-js";
import { CouncilCliConfig, config } from "../../../../config.js";

export default command({
  description: "The value to set",
  handler: ({ params }) => {
    const { setting, value } = params as {
      setting: keyof CouncilCliConfig;
      value: string;
    };
    config.set(setting, value);
  },
});
