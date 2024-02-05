import Table from "cli-table";
import { command } from "clide-js";
import { config } from "../../config.js";

export default command({
  description: "Print all settings out as a table",
  handler: () => {
    const data = config.data;
    const table = new Table({
      rows: Object.entries(data).filter(
        ([_, value]: unknown[]) => value !== undefined,
      ),
    });
    console.log(table.toString());
  },
});
