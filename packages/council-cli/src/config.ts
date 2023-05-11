import { getOSConfigDir } from "./utils/getOSConfigDir";
import { JSONStore } from "./utils/JSONStore";

export interface CouncilClIConfig {
  "rpc-url"?: string;
}

// TODO: Test if this will work in environments like an AWS Lambda and ensure
// graceful fallbacks if not.
export const config = new JSONStore<CouncilClIConfig>({
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
