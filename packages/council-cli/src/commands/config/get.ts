import prompts from "prompts";
import signale from "signale";
import { config, CouncilClIConfig } from "src/config";
import { ArgumentsCamelCase } from "yargs";

export const command = "get [setting]";

export const describe = "Get a setting";

export async function handler(
  argv: ArgumentsCamelCase<{
    setting?: string;
  }>,
): Promise<void> {
  let setting = argv.setting;

  if (!setting) {
    const promptResult = await prompts({
      type: "text",
      name: "setting",
      message: "Enter setting name",
    });
    setting = promptResult.setting;
  }

  try {
    const value = config.get(setting as keyof CouncilClIConfig);
    signale.info(value);
  } catch (err) {
    signale.error((err as Error).message);
  }
}
