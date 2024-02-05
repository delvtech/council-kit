import { SimpleCache } from "@council/evm-client";
import { createViemNetwork } from "@council/evm-client-viem";
import { ReadWriteMockToken } from "@delvtech/council-core";
import { createViemReadWriteContractFactory } from "src/contract/createViemReadWriteContractFactory";
import { PublicClient, WalletClient } from "viem";

export interface ViemReadWriteMockTokenOptions {
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

export class ViemReadWriteMockToken extends ReadWriteMockToken {
  constructor({
    address,
    publicClient,
    walletClient,
    cache,
    namespace,
  }: ViemReadWriteMockTokenOptions) {
    super({
      address,
      name: namespace,
      network: createViemNetwork(publicClient),
      contractFactory: createViemReadWriteContractFactory({
        publicClient,
        walletClient,
        cache,
        namespace,
      }),
    });
  }
}
