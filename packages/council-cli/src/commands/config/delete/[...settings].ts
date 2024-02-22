import { command } from "clide-js";
import signale from "signale";
import { config, CouncilCliConfig } from "../../../config.js";

export default command({
  description: "Delete a setting",
  handler: ({ params }) => {
    const { settings } = params as {
      settings: (keyof CouncilCliConfig)[];
    };
    config.delete(...settings);
    signale.success(`Deleted settings: ${settings.join(", ")}`);
  },
});
