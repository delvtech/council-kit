import {
  Abi,
  Drift,
  EventLog,
  EventName,
  GetEventsParams,
} from "@delvtech/drift";
import { CouncilSdkError } from "src/error";

export async function getEventsWithSplitAndRetry<
  A extends Abi,
  E extends EventName<A>,
>({
  params,
  drift,
  earliestBlock,
  /**
   * The maximum number of times to split failed event requests into smaller
   * requests before giving up. Defaults to 4.
   */
  maxRetries = 4,
}: {
  params: GetEventsParams<A, E>;
  drift: Drift;
  earliestBlock?: bigint;
  maxRetries?: number;
}): Promise<EventLog<A, E>[]> {
  let chunkedParams = [params];
  let error: Error | undefined;
  let retries = maxRetries;

  while (retries) {
    let nextChunkedParams: GetEventsParams<A, E>[] = [];
    let nextError;

    const chunkedEvents = await Promise.all(
      chunkedParams.map(async (params) => {
        let { fromBlock, toBlock } = params;

        // Check the cache for the chunk
        const cacheKey = await drift.cache.eventsKey(params);
        if (await drift.cache.has(cacheKey)) {
          nextChunkedParams.push(params);
          return drift.cache.get(cacheKey) as Promise<EventLog<A, E>[]>;
        }

        const chunk = await drift.adapter
          .getEvents(params)
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
              const block = await drift.getBlock();
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
            nextChunkedParams.push(
              {
                ...params,
                fromBlock,
                toBlock: middleBlock,
              },
              {
                ...params,
                fromBlock: middleBlock + 1n,
                toBlock,
              },
            );
          });

        if (chunk) {
          drift.cache.preloadEvents({
            ...params,
            value: chunk,
          });
          nextChunkedParams.push(params);
          return chunk;
        }

        return [];
      }),
    );

    if (!nextError) {
      return chunkedEvents.flat();
    }

    chunkedParams = nextChunkedParams;
    error = nextError;
    retries--;
  }

  throw (
    error ||
    new CouncilSdkError(
      `Unknown error fetching '${params.event}' events from ${params.address}`,
    )
  );
}
