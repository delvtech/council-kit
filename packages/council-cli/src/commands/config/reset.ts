import { config } from "src/config";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, describe, handler } = createCommandModule({
  command: "reset",
  describe: "Reset settings to default",

  handler: async () => {
    config.reset();
  },
});
