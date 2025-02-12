import { command } from "clide-js";
import { config } from "../../config.js";

export default command({
  description: "Print all settings out as a table",
  handler: () => {
    console.table(config.data);
  },
});
