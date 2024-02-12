import { ReadWriteMockToken as BaseReadWriteMockToken } from "@delvtech/council-core";
import { SimpleCache, createNetwork } from "@delvtech/evm-client-ethers";
import { Provider, Signer } from "ethers";
import { createReadWriteContractFactory } from "src/contract/createReadWriteContractFactory";

export interface ReadWriteMockTokenOptions {
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

export class ReadWriteMockToken extends BaseReadWriteMockToken {
  constructor({
    address,
    provider,
    signer,
    cache,
    namespace,
  }: ReadWriteMockTokenOptions) {
    super({
      address,
      name: namespace,
      network: createNetwork(provider),
      contractFactory: createReadWriteContractFactory({
        provider,
        signer,
        cache,
        namespace,
      }),
    });
  }
}
