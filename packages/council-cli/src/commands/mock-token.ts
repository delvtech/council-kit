import { command, passThroughCommand } from "clide-js";

export default command({
  ...passThroughCommand,
  description: "Interact with a MockERC20 contract",
});
