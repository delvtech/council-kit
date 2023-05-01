import prompts from "prompts";
import signale from "signale";
import { config, CouncilClIConfig } from "src/config";
import { ArgumentsCamelCase } from "yargs";

export const command = "set [setting] [value]";

export const describe = "Set a setting";

export async function handler(
  argv: ArgumentsCamelCase<{
    setting?: string;
    value?: string;
  }>,
): Promise<void> {
  let setting = argv.setting;
  let value = argv.value;

  if (!setting) {
    const promptResult = await prompts({
      type: "text",
      name: "setting",
      message: "Enter setting name",
    });
    setting = promptResult.setting;
  }

  if (!value) {
    const promptResult = await prompts({
      type: "text",
      name: "value",
      message: "Enter value",
    });
    value = promptResult.value;
  }

  try {
    config.set(setting as keyof CouncilClIConfig, value);
  } catch (err) {
    signale.error((err as Error).message);
  }
}
