import { command } from "clide-js";
import { config } from "../../config.js";

export default command({
  description: "Reset settings to default",
  handler: () => config.reset(),
});
