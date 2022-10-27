// TODO - refactor folder structure

import { chain, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

// TODO: explore other provider options
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
  ]
);

export { chains, provider };
