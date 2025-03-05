import { createCouncil } from "@delvtech/council-js";
import { viemAdapter } from "@delvtech/drift-viem";
import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type PublicClient,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

export const publicClient: PublicClient = createPublicClient({
  transport: http(process.env.RPC_URL),
});

export let walletClient: WalletClient | undefined;

if (process.env.WALLET_PRIVATE_KEY) {
  walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as Address),
    transport: http(process.env.RPC_URL),
  });
}

export const council = createCouncil({
  adapter: viemAdapter({ publicClient, walletClient }),
});

export const drift = council.drift;
