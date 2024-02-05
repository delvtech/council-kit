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
  [formatChainName(localhost.name)]: localhost,
  [formatChainName(mainnet.name)]: mainnet,
  [formatChainName(goerli.name)]: goerli,
  [formatChainName(sepolia.name)]: sepolia,
  [formatChainName(optimism.name)]: optimism,
  [formatChainName(arbitrum.name)]: arbitrum,
  [formatChainName(polygon.name)]: polygon,
};

export type SupportedChain = keyof typeof supportedChains;

export function formatChainName<K extends string>(key: K): HyphenCase<K> {
  return key.replace(" ", "-").toLowerCase() as HyphenCase<K>;
}

export type HyphenCase<T extends string> = T extends `${infer A}${infer B}`
  ? B extends ` ${infer C}`
    ? `${Lowercase<A>}-${HyphenCase<Lowercase<C>>}`
    : `${Lowercase<A>}${HyphenCase<B>}`
  : T;
