import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { SupportedChainId } from "src/config/council.config";
import { HttpTransport } from "viem";
import { http } from "wagmi";
import { anvil, Chain, goerli, mainnet } from "wagmi/chains";

export const chains: {
  [ChainId in SupportedChainId]: Chain & { id: ChainId };
} = {
  1: mainnet,
  5: goerli,
  31337: anvil,
};

export const transports: Record<SupportedChainId, HttpTransport> = {
  1: http(process.env.NEXT_PUBLIC_MAINNET_RPC_URL),
  5: http(process.env.NEXT_PUBLIC_GOERLI_RPC_URL),
  31337: http(process.env.NEXT_PUBLIC_LOCAL_RPC_URL),
};

const wallets = [injectedWallet, safeWallet, rainbowWallet, metaMaskWallet];
const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (walletConnectId) {
  wallets.push(walletConnectWallet);
} else if (process.env.NODE_ENV === "development") {
  console.warn(
    "Missing WalletConnect project ID. Set the NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID variable in your environment to use WalletConnect.",
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "Council",
  projectId: walletConnectId || "",
  chains: Object.values(chains) as [Chain, ...Chain[]],
  transports,
  wallets: [
    {
      groupName: "Wallets",
      wallets,
    },
  ],
});
