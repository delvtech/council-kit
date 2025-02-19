import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { councilConfigs } from "src/config/council.config";
import { http } from "wagmi";
import { Chain, goerli, hardhat, localhost, mainnet } from "wagmi/chains";

const configuredChainIds = Object.keys(councilConfigs);

const allChains = [mainnet, goerli, hardhat, localhost];
const rpcUrlsByChainId: Record<string, string | undefined> = {
  1: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  5: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
  1337: process.env.NEXT_PUBLIC_LOCAL_RPC_URL,
  31337: process.env.NEXT_PUBLIC_LOCAL_RPC_URL,
};

export const chains = Object.values(allChains).filter(({ id }) =>
  configuredChainIds.includes(String(id)),
);

export const transports = Object.fromEntries(
  chains.map(({ id }) => {
    return [id, http(rpcUrlsByChainId[id])];
  }),
);

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
  projectId: walletConnectId || "",
  chains: allChains as Chain[] as [Chain, ...Chain[]],
  transports,
  wallets: [
    {
      groupName: "Wallets",
      wallets,
    },
  ],
});
