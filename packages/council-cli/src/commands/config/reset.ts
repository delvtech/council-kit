import signale from "signale";
import { config } from "src/config";

export const command = "reset";

export const describe = "Reset settings to default";

export async function handler(): Promise<void> {
  try {
    config.reset();
  } catch (err) {
    signale.error((err as Error).message);
  }
}
