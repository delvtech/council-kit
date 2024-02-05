import { SimpleCache } from "@council/evm-client";
import { createEthersNetwork } from "@council/evm-client-ethers";
import { ReadWriteMockToken } from "@delvtech/council-core";
import { Provider, Signer } from "ethers";
import { createEthersReadWriteContractFactory } from "src/contract/createEthersReadWriteContractFactory";

export interface EthersReadWriteMockTokenOptions {
  address: `0x${string}`;
  provider: Provider;
  signer: Signer;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export class EthersReadWriteMockToken extends ReadWriteMockToken {
  constructor({
    address,
    provider,
    signer,
    cache,
    namespace,
  }: EthersReadWriteMockTokenOptions) {
    super({
      address,
      name: namespace,
      network: createEthersNetwork(provider),
      contractFactory: createEthersReadWriteContractFactory({
        provider,
        signer,
        cache,
        namespace,
      }),
    });
  }
}
