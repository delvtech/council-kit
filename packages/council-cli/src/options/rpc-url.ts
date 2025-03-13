import { option } from "clide-js";
import { config } from "../config.js";

export const rpcUrlOption = option({
  alias: ["rpc-url"],
  description: "An RPC URL to send the transaction request to",
  type: "string",
  required: true,
  default: config.get("rpcUrl"),
});
