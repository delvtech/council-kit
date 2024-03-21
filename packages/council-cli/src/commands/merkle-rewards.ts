import { command, passThroughCommand } from "clide-js";

export default command({
  ...passThroughCommand,
  description:
    "Do something for merkle rewards, like create a tree with proofs.",
});
