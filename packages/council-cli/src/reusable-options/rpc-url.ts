import { OptionConfig } from "clide-js";

export const rpcUrlOption = {
  alias: ["rpc", "rpc-url"],
  description: "A RPC URL to send the transaction request to",
  type: "string",
  required: true,
  default: process.env.RPC_URL || "http://127.0.0.1:8545",
} as const satisfies OptionConfig;
