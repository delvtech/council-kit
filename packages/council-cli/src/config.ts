import { JsonStore } from "./utils/config/JsonStore.js";
import { getOSConfigDir } from "./utils/config/getOSConfigDir.js";

const configSettingNames = ["rpc-url"] as const;

export type CouncilCliConfig = Partial<
  Record<(typeof configSettingNames)[number], string>
>;

// TODO: Test if this will work in environments like an AWS Lambda and ensure
// graceful fallbacks if not.
export const config = new JsonStore<CouncilCliConfig>({
  path: getOSConfigDir("council"),
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
