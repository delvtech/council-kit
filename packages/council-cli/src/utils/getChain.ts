import {
  arbitrum,
  Chain,
  goerli,
  localhost,
  mainnet,
  optimism,
  sepolia,
} from "viem/chains";

export type SupportedChain =
  | "localhost"
  | "mainnet"
  | "goerli"
  | "sepolia"
  | "optimism"
  | "arbitrum";

export function getChain(chainName: SupportedChain = "localhost"): Chain {
  switch (chainName) {
    case "localhost":
      return localhost;
    case "mainnet":
      return mainnet;
    case "goerli":
      return goerli;
    case "sepolia":
      return sepolia;
    case "optimism":
      return optimism;
    case "arbitrum":
      return arbitrum;
    default:
      throw new Error(`Unsupported chain: ${chainName}`);
  }
}
