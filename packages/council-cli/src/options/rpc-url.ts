import { option } from "clide-js";

export const rpcUrlOption = option({
  alias: ["rpc-url"],
  description: "An RPC URL to send the transaction request to",
  type: "string",
  required: true,
  default: process.env.RPC_URL || "http://127.0.0.1:8545",
});
