import { ReadCouncil as BaseReadCouncil } from "@delvtech/council-core";
import { SimpleCache, createNetwork } from "@delvtech/evm-client-ethers";
import { Provider } from "ethers";
import { createReadContractFactory } from "src/contract/createReadContractFactory";

export interface ReadCouncilOptions {
  provider: Provider;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export class ReadCouncil extends BaseReadCouncil {
  constructor({ provider, cache, namespace }: ReadCouncilOptions) {
    super({
      name: namespace,
      network: createNetwork(provider),
      contractFactory: createReadContractFactory({
        provider,
        cache,
        namespace,
      }),
    });
  }
}
