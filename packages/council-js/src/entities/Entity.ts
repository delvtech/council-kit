import {
  Adapter,
  Address,
  ClientConfig,
  ContractWriteOptions,
  Drift,
  OnMinedParam,
  OneOf,
  createDrift,
} from "@delvtech/drift";
import { CouncilSdkError } from "src/error";

/**
 * The maximum number of times to split a failed event request into smaller
 * requests before giving up.
 */
const MAX_EVENT_SPLIT_RETRIES = 4;

/**
 * Configuration options for an {@link Entity}.
 */
export type EntityConfig<A extends Adapter = Adapter> = OneOf<
  | {
      drift?: Drift<A>;
    }
  | ClientConfig<A>
> & {
  /**
   * The earliest block to fetch events from.
   */
  earliestBlock?: bigint;
};

/**
 * A base class for SDK entities.
 */
export class Entity<A extends Adapter = Adapter> {
  drift: Drift<A>;

  constructor({ drift, earliestBlock, ...driftConfig }: EntityConfig<A> = {}) {
    this.drift = drift || createDrift(driftConfig);

    // Overwrite `fromBlock` if earlier than the `earliestBlock` option.
    if (earliestBlock) {
      this.drift.hooks.on("before:getEvents", ({ args, setArgs }) => {
        const { fromBlock, ...params } = args[0];
        if (
          !fromBlock ||
          fromBlock === "earliest" ||
          (typeof fromBlock === "bigint" && fromBlock < earliestBlock)
        ) {
          setArgs({
            ...params,
            fromBlock: earliestBlock,
          });
        }
      });
    }

    // Extend the drift instance to override the `getEvents` method with
    // logic to split failed requests into multiple smaller requests.
    this.drift.extend({
      async getEvents(params) {
        let chunks = [params];
        let error = new CouncilSdkError(
          `Unknown error fetching '${params.event}' events from ${params.address}`,
        );
        let retries = 0;

        while (retries <= MAX_EVENT_SPLIT_RETRIES) {
          let nextChunks: (typeof params)[] = [];
          let nextError;

          const chunkedEvents = await Promise.all(
            chunks.map(async (chunkParams) => {
              let { fromBlock, toBlock } = chunkParams;

              // Check the cache for the chunk
              const cacheKey = await this.cache.eventsKey(chunkParams);
              if (await this.cache.has(cacheKey)) {
                nextChunks.push(chunkParams);
                // Casting as never causes this arm of the function to be
                // ignored in the inferred return type. This is done to avoid
                // having to rewrite the type signature of the `getEvents`
                // method which has multiple type parameters.
                return this.cache.get(cacheKey) as never;
              }

              const chunk = await this.adapter
                .getEvents(chunkParams)
                // Split the request into 2 smaller requests if it throws an error
                .catch(async (e) => {
                  nextError = new CouncilSdkError(e);

                  // Check if the chunk is too small to split
                  if (
                    toBlock === 0n ||
                    toBlock === "earliest" ||
                    fromBlock === toBlock ||
                    // Implies the chunk starts at "finalized", "latest", "safe", or "pending"
                    (typeof fromBlock === "string" && fromBlock !== "earliest")
                  ) {
                    throw nextError;
                  }

                  // Coerce fromBlock and toBlock to bigints to find the middle
                  if (typeof fromBlock !== "bigint") {
                    fromBlock = earliestBlock || 0n;
                  }
                  if (typeof toBlock !== "bigint") {
                    const block = await this.getBlock();
                    if (!block?.number) {
                      throw nextError;
                    }
                    toBlock = block.number;
                  }

                  // Check again if they're the same after coercion
                  if (fromBlock === toBlock) {
                    throw nextError;
                  }

                  const middleBlock = fromBlock + (toBlock - fromBlock) / 2n;
                  nextChunks.push(
                    {
                      ...chunkParams,
                      fromBlock,
                      toBlock: middleBlock,
                    },
                    {
                      ...chunkParams,
                      fromBlock: middleBlock + 1n,
                      toBlock,
                    },
                  );
                });

              if (chunk) {
                this.cache.preloadEvents({
                  ...chunkParams,
                  value: chunk,
                });
                nextChunks.push(chunkParams);
                return chunk;
              }

              return [];
            }),
          );

          if (!nextError) {
            return chunkedEvents.flat();
          }

          chunks = nextChunks;
          error = nextError;
          retries++;
        }

        throw error;
      },
    });
  }
}

/**
 * Params for write operations on an {@linkcode Entity}.
 *
 * @template Args Additional parameters for the write operation.
 */
export type EntityWriteParams<Args> = {
  args: Args;
  options?: ContractWriteOptions & OnMinedParam;
};

// Contract //

/**
 * Configuration options for an {@linkcode Entity} that represents a specific
 * contract.
 */
export type ContractEntityConfig<A extends Adapter = Adapter> = {
  /**
   * The address of the contract.
   */
  address: Address;
} & EntityConfig<A>;
