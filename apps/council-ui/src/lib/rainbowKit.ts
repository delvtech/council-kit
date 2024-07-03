import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { chains, transports } from "src/lib/wagmi";

const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const wallets = [injectedWallet, safeWallet, rainbowWallet, metaMaskWallet];

// WalletConnect
if (walletConnectId) {
  wallets.push(walletConnectWallet);
} else if (process.env.NODE_ENV === "development") {
  console.warn(
    "Missing WalletConnect project ID. Set the NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID variable in your environment to use WalletConnect.",
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "Council",
  projectId: walletConnectId || "0",
  chains: chains as any,
  transports,
  wallets: [
    {
      groupName: "Wallets",
      wallets,
    },
  ],
});
