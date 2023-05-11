import signale from "signale";
import { config, CouncilClIConfig } from "src/config";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { ArgumentsCamelCase } from "yargs";

export const { command, describe, handler } = createCommandModule({
  command: "get [setting]",
  describe: "Get a setting",

  handler: async (
    args: ArgumentsCamelCase<{
      setting?: string;
    }>,
  ) => {
    const setting = await requiredString(args.setting, {
      name: "setting",
      message: "Enter setting name",
    });

    const value = config.get(setting as keyof CouncilClIConfig);
    signale.info(value);
  },
});
