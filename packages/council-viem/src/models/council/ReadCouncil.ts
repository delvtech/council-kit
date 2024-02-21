import { ReadCouncil as BaseReadCouncil } from "@delvtech/council-core";
import { SimpleCache, createNetwork } from "@delvtech/evm-client-viem";
import { createReadContractFactory } from "src/contract/createReadContractFactory";
import { Client } from "viem";

export interface ReadCouncilOptions {
  client: Client;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export class ReadCouncil extends BaseReadCouncil {
  constructor({ client, cache, namespace }: ReadCouncilOptions) {
    super({
      name: namespace,
      network: createNetwork(client),
      contractFactory: createReadContractFactory({
        client,
        cache,
        namespace,
      }),
    });
  }
}
