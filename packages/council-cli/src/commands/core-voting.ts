import { command, passThroughCommand } from "clide-js";

export default command({
  ...passThroughCommand,
  description: "Interact with a CoreVoting contract",
});
