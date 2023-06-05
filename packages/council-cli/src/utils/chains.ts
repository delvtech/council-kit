import {
  arbitrum,
  goerli,
  localhost,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "viem/chains";

export const supportedChains = {
  localhost,
  mainnet,
  goerli,
  sepolia,
  optimism,
  arbitrum,
  polygon,
};

export type SupportedChain = keyof typeof supportedChains;

export const supportedChainNames = Object.keys(
  supportedChains,
) as SupportedChain[];
