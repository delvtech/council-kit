import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { chains, transports } from "src/lib/wagmi";

const { NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID, NODE_ENV } = process.env;
const wallets = [injectedWallet, safeWallet, rainbowWallet, metaMaskWallet];

// WalletConnect
if (NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  wallets.push(walletConnectWallet);
} else if (NODE_ENV === "development") {
  console.warn(
    "Missing WalletConnect project ID. Set the NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID variable in your environment to use WalletConnect.",
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "Council",
  projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "0",
  chains: chains as any,
  transports,
  wallets: [
    {
      groupName: "Wallets",
      wallets,
    },
  ],
});
