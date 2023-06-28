import { requiredSecret } from "src/options/utils/requiredSecret";

export const walletKeyOption = {
  alias: ["wallet-key"],
  describe: "A wallet key to sign and pay for the transaction",
  type: "string",
  hidden: true,
  default: process.env.WALLET_PRIVATE_KEY,
} as const;

export async function requiredWalletKey(walletKey?: string): Promise<string> {
  return await requiredSecret(walletKey, {
    name: "wallet-key",
    message: "Enter wallet key",
    initial: process.env.WALLET_PRIVATE_KEY,
  });
}
