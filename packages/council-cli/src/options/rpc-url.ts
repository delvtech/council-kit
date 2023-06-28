import { config } from "src/config";
import { requiredString } from "src/options/utils/requiredString";

export const rpcUrlOption = {
  alias: ["rpc", "rpc-url"],
  describe: "A RPC URL to send the transaction request to",
  type: "string",
  default: process.env.RPC_URL || config.get("rpc-url"),
} as const;

export async function requiredRpcUrl(rpcUrl?: string): Promise<string> {
  return await requiredString(rpcUrl, {
    name: "rpc-url",
    message: "Enter RPC URL",
    initial: process.env.RPC_URL || config.get("rpc-url"),
  });
}
