import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export const publicClient = createPublicClient({
  transport: http(process.env.PROVIDER_URI),
});

export const walletClient =
  process.env.WALLET_PRIVATE_KEY &&
  createWalletClient({
    account: privateKeyToAccount(
      process.env.WALLET_PRIVATE_KEY as `0x${string}`,
    ),
    transport: http(process.env.PROVIDER_URI),
  });
