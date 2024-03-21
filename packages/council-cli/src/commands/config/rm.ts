import { command } from "clide-js";
import { config } from "../../config.js";

export default command({
  description: "Remove the configuration file",
  handler: () => config.rm(),
});
