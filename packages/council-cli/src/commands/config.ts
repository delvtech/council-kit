import { command, passThroughCommand } from "clide-js";

export default command({
  ...passThroughCommand,
  description: "Manage configuration options for the Council CLI",
});
