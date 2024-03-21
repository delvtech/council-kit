import { command, passThroughCommand } from "clide-js";

export default command({
  ...passThroughCommand,
  description: `The setting to change. Possible values are:
  - 'rpc-url' to set the rpc url
`,
});
