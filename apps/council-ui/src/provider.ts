import { councilConfigs } from "src/config/council.config";
import { allChains, ChainProviderFn, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const supportedChainIds = Object.keys(councilConfigs);

const configuredChains = allChains.filter((chain) => {
  // Wagmi has 2 chains with the 31337 id, Hardhat and Foundry. Calling
  // configureChains with 2 chains using the same id will cause errors, so we
  // filter them out here to make room for a custom one.
  return chain.id !== 31337 && supportedChainIds.includes(`${chain.id}`);
});

// Add a general Localhost chain for 31337 if in development
if (
  supportedChainIds.includes("31337") &&
  process.env.NODE_ENV === "development"
) {
  configuredChains.push({
    id: 31337,
    name: "Localhost",
    network: "localhost",
    rpcUrls: {
      default: process.env.NEXT_PUBLIC_LOCAL_RPC_URL || "http://127.0.0.1:8545",
    },
  });
}

const configuredProviders = configuredChains.map((chain) => {
  if (chain.id === 1) {
    const mainnetAlchemyKey = process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_KEY;
    if (!mainnetAlchemyKey) {
      console.error(
        "Chain ID 1 (mainnet) exists in council.config.ts, but no provider was given, see .env",
      );
    }
    return alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_KEY,
    });
  }

  if (chain.id === 5) {
    const goerliAlchemyKey = process.env.NEXT_PUBLIC_GOERLI_ALCHEMY_KEY;
    if (!goerliAlchemyKey) {
      console.error(
        "Chain ID 5 (goerli) exists in council.config.ts, but no provider was given, see .env",
      );
    }
    return alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_GOERLI_ALCHEMY_KEY,
    });
  }

  if (chain.id === 31337) {
    const provider = jsonRpcProvider({
      rpc: () => ({ http: chain.rpcUrls.default }),
    });
    return provider;
  }
}) as ChainProviderFn[]; // safe to cast

/**
 * Use configureChains from wagmi to specify providers for each chain at
 * config-time.
 *
 * See: https://wagmi.sh/docs/providers/configuring-chains
 */
export const { provider, chains } = configureChains(
  configuredChains,
  // If a provider does not support a chain, it will fall back onto the next one
  // in the array.
  configuredProviders,
);
