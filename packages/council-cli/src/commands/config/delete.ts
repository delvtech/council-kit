import prompts from "prompts";
import signale from "signale";
import { config, CouncilClIConfig } from "src/config";
import { ArgumentsCamelCase } from "yargs";

export const command = "delete [settings...]";

export const describe = "Delete a setting";

export async function handler(
  argv: ArgumentsCamelCase<{
    settings?: string[];
  }>,
): Promise<void> {
  let settings = argv.settings;

  if (!settings) {
    const promptResult = await prompts({
      type: "list",
      separator: " ",
      name: "settings",
      message: "Enter setting names",
    });
    settings = promptResult.settings;
  }

  try {
    config.delete(...(settings as (keyof CouncilClIConfig)[]));
    signale.success();
  } catch (err) {
    signale.error((err as Error).message);
  }
}
