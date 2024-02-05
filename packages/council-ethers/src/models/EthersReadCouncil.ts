import { SimpleCache } from "@council/evm-client";
import { createEthersNetwork } from "@council/evm-client-ethers";
import { ReadCouncil } from "@delvtech/council-core";
import { Provider } from "ethers";
import { createEthersReadContractFactory } from "src/contract/createEthersReadContractFactory";

export interface EthersReadCouncilOptions {
  provider: Provider;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export class EthersReadCouncil extends ReadCouncil {
  constructor({ provider, cache, namespace }: EthersReadCouncilOptions) {
    super({
      name: namespace,
      network: createEthersNetwork(provider),
      contractFactory: createEthersReadContractFactory({
        provider,
        cache,
        namespace,
      }),
    });
  }
}
