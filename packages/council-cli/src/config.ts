import { getAppRootDir } from "./utils/config/getAppRootDir.js";
import { JsonStore } from "./utils/config/JsonStore.js";

const configSettingNames = ["rpc-url"] as const;

export type CouncilCliConfig = Partial<
  Record<(typeof configSettingNames)[number], string>
>;

export const config = new JsonStore<CouncilCliConfig>({
  path: getAppRootDir(),
  name: "cli",
  defaults: {
    "rpc-url": process.env.RPC_URL,
  },
  schema: {
    "rpc-url": {
      type: "string",
    },
  },
});
