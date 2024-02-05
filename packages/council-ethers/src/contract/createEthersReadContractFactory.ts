import { SimpleCache } from "@council/evm-client";
import { createEthersCachedReadContract } from "@council/evm-client-ethers";
import { CachedReadContractFactory } from "@delvtech/council-core";
import { Provider } from "ethers";

export interface CreateEthersReadContractFactoryOptions {
  provider: Provider;
  cache?: SimpleCache;
  namespace?: string;
}

export function createEthersReadContractFactory(
  options: CreateEthersReadContractFactoryOptions,
): CachedReadContractFactory {
  return (factoryOptions) => {
    return createEthersCachedReadContract({
      ...options,
      ...factoryOptions,
    });
  };
}
