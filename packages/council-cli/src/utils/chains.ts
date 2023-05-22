import {
  arbitrum,
  goerli,
  localhost,
  mainnet,
  optimism,
  sepolia,
} from "viem/chains";

export const supportedChains = {
  localhost,
  mainnet,
  goerli,
  sepolia,
  optimism,
  arbitrum,
};

export type SupportedChain = keyof typeof supportedChains;
