import { command, passThroughCommand } from "clide-js";

export default command({
  ...passThroughCommand,
  description: "Encode call data for a contract function",
});
