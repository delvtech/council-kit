import { command, passThroughCommand } from "clide-js";

export default command({
  ...passThroughCommand,
  description: "Set a configuration value",
});
