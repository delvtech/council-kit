import { SimpleCache, createNetwork } from "@council/evm-client-viem";
import { ReadCouncil as BaseReadCouncil } from "@delvtech/council-core";
import { createReadContractFactory } from "src/contract/createReadContractFactory";
import { PublicClient } from "viem";

export interface ReadCouncilOptions {
  publicClient: PublicClient;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export class ReadCouncil extends BaseReadCouncil {
  constructor({ publicClient, cache, namespace }: ReadCouncilOptions) {
    super({
      name: namespace,
      network: createNetwork(publicClient),
      contractFactory: createReadContractFactory({
        publicClient,
        cache,
        namespace,
      }),
    });
  }
}
