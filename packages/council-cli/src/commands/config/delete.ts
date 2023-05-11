import signale from "signale";
import { config, CouncilClIConfig } from "src/config";
import { requiredArray } from "src/options/utils/requiredArray";
import { createCommandModule } from "src/utils/createCommandModule";
import { ArgumentsCamelCase } from "yargs";

export const { command, describe, handler } = createCommandModule({
  command: "delete [settings...]",
  describe: "Delete a setting",

  handler: async (
    // TODO: parse command for arg types
    args: ArgumentsCamelCase<{
      settings?: string[];
    }>,
  ) => {
    const settings = await requiredArray(args.settings, {
      name: "settings",
      message: "Enter setting names",
    });

    config.delete(...(settings as (keyof CouncilClIConfig)[]));
    signale.success(`Deleted settings: ${settings.join(", ")}`);
  },
});
