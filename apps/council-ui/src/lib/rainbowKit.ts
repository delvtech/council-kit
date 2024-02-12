import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { chains, transports } from "src/lib/wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Missing WalletConnect project ID. Please set the NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID variable in your environment.",
  );
}

export const rainbowKitConfig = getDefaultConfig({
  appName: "Council",
  projectId,
  chains: chains as any,
  transports,
});
