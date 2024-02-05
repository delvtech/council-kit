import { SimpleCache } from "@council/evm-client";
import { createViemNetwork } from "@council/evm-client-viem";
import { ReadCouncil } from "@delvtech/council-core";
import { createViemReadContractFactory } from "src/contract/createViemReadContractFactory";
import { PublicClient } from "viem";

export interface ViemReadCouncilOptions {
  publicClient: PublicClient;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export class ViemReadCouncil extends ReadCouncil {
  constructor({ publicClient, cache, namespace }: ViemReadCouncilOptions) {
    super({
      name: namespace,
      network: createViemNetwork(publicClient),
      contractFactory: createViemReadContractFactory({
        publicClient,
        cache,
        namespace,
      }),
    });
  }
}
