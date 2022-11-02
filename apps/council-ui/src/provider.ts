import { configureChains, allChains } from "wagmi";
import { ChainProviderFn } from "@wagmi/core";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const configuredProviders: ChainProviderFn[] = [];
if (process.env.NEXT_PUBLIC_ALCHEMY_KEY) {
  configuredProviders.push(
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
  );
}

const localRpcUrl = process.env.NEXT_PUBLIC_LOCAL_RPC_URL;
if (localRpcUrl) {
  configuredProviders.push(
    jsonRpcProvider({
      rpc: () => {
        return { http: localRpcUrl };
      },
    }),
  );
}

/**
 * Use configureChains from wagmi to specify providers for each chain at
 * config-time.
 *
 * See: https://wagmi.sh/docs/providers/configuring-chains
 */
export const { provider, chains } = configureChains(
  allChains,
  // If a provider does not support a chain, it will fall back onto the next one
  // in the array.
  configuredProviders,
);
