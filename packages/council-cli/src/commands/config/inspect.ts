import Table from "cli-table";
import signale from "signale";
import { config } from "src/config";

export const command = "inspect";

export const describe = "Print all settings out as a table";

export async function handler(): Promise<void> {
  try {
    const table = new Table({
      rows: Object.entries(config.data),
    });
    console.log(`${table.toString()}`);
  } catch (err) {
    signale.error((err as Error).message);
  }
}
