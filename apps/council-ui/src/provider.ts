import { CouncilConfig } from "src/config/CouncilConfig";
import { Chain, chain, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const LOCAL_RPC_HOST = "http://127.0.0.1:8545";

let mainnetConfig: Promise<CouncilConfig>;
const mainnetConfigPath = "src/council-mainnet.config";
try {
  mainnetConfig = require(mainnetConfigPath);
} catch (err) {
  console.warn(`No config for mainnet found at ${mainnetConfigPath}.`);
}

let goerliConfig: CouncilConfig;
const goerliConfigPath = "src/council-goerli.config";
try {
  goerliConfig = require(goerliConfigPath);
} catch (err) {
  console.warn(`No config for goerli found at ${goerliConfigPath}.`);
}

let localConfig;
const localConfigPath = "src/council-local.config";
try {
  localConfig = require(localConfigPath);
} catch (err) {
  console.warn(`No config for local found at ${localConfigPath}.`);
}

/**
 * Use configureChains from wagmi to specify providers for each chain at
 * config-time.
 *
 * See: https://wagmi.sh/docs/providers/configuring-chains
 */

const configuredChains: Chain[] = [];
const configuredProviders = [];
if (process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_ID && mainnetConfig) {
  configuredChains.push(chain.mainnet);
  configuredProviders.push(
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_ID }),
  );
}
if (process.env.NEXT_PUBLIC_GOERLI_ALCHEMY_ID && goerliConfig) {
  configuredChains.push(chain.goerli);
  configuredProviders.push(
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_GOERLI_ALCHEMY_ID }),
  );
}
const localRpcUrl = process.env.NEXT_PUBLIC_LOCAL_RPC_URL;
if (localRpcUrl && localConfig) {
  configuredChains.push(chain.localhost);
  configuredProviders.push(
    jsonRpcProvider({
      rpc: () => ({
        http: localRpcUrl,
      }),
    }),
  );
}

export const { chains, provider } = configureChains(
  configuredChains,
  // If a provider does not support a chain, it will fall back onto the next one
  // in the array.
  configuredProviders,
);
