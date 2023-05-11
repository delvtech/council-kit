import { config, CouncilClIConfig } from "src/config";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { ArgumentsCamelCase } from "yargs";

export const { command, describe, handler } = createCommandModule({
  command: "set [setting] [value]",
  describe: "Set a setting",

  handler: async (
    args: ArgumentsCamelCase<{
      setting?: string;
      value?: string;
    }>,
  ) => {
    const setting = await requiredString(args.setting, {
      name: "setting",
      message: "Enter setting name",
    });

    const value = await requiredString(args.value, {
      name: "value",
      message: "Enter value",
    });

    config.set(setting as keyof CouncilClIConfig, value);
  },
});
