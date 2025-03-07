import { option } from "clide-js";

export const walletKeyOption = option({
  alias: ["wallet-key"],
  description: "A wallet key to sign and pay for the transaction",
  type: "secret",
  required: true,
  default: process.env.WALLET_PRIVATE_KEY,
});
