import {
  arbitrum,
  goerli,
  hardhat,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "viem/chains";

export const supportedChains = {
  localhost: hardhat,
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
