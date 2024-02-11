import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { councilConfigs } from "src/config/council.config";
import { http } from "wagmi";
import { goerli, hardhat, mainnet } from "wagmi/chains";

const configuredChainIds = Object.keys(councilConfigs);

const allChains = [mainnet, goerli, hardhat];
const rpcUrlsByChainId: Record<string, string | undefined> = {
  1: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  5: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
  31337: process.env.NEXT_PUBLIC_LOCAL_RPC_URL,
};

export const chains = Object.values(allChains).filter(({ id }) =>
  configuredChainIds.includes(String(id)),
);

export const transports = Object.fromEntries(
  Object.entries(allChains).map(([id]) => {
    return [id, http(rpcUrlsByChainId[id])];
  }),
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Missing WalletConnect project ID. Please set the NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID variable in your environment.",
  );
}

export const config = getDefaultConfig({
  appName: "Council",
  projectId,
  chains: chains as any,
  transports,
});
