import Table from "cli-table";
import { config } from "src/config";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, describe, handler } = createCommandModule({
  command: "inspect",
  describe: "Print all settings out as a table",

  handler: async () => {
    const table = new Table({
      rows: Object.entries(config.data),
    });
    console.log(table.toString());
  },
});
