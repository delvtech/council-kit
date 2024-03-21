import { ReadWriteMockToken as BaseReadWriteMockToken } from "@delvtech/council-core";
import { SimpleCache, createNetwork } from "@delvtech/evm-client-viem";
import { createReadWriteContractFactory } from "src/contract/createReadWriteContractFactory";
import { PublicClient, WalletClient } from "viem";

export interface ReadWriteMockTokenOptions {
  address: `0x${string}`;
  publicClient: PublicClient;
  walletClient: WalletClient;
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
    publicClient,
    walletClient,
    cache,
    namespace,
  }: ReadWriteMockTokenOptions) {
    super({
      address,
      name: namespace,
      network: createNetwork(publicClient),
      contractFactory: createReadWriteContractFactory({
        publicClient,
        walletClient,
        cache,
        namespace,
      }),
    });
  }
}
