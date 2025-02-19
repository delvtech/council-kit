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
import { getEventsWithSplitAndRetry } from "src/utils/getEventsWithSplitAndRetry";

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
    this.drift = (drift || createDrift(driftConfig)).extend({
      // Override the `getEvents` method with
      getEvents: ({ fromBlock = earliestBlock, ...restParams }) => {
        // Overwrite `fromBlock` if earlier than the `earliestBlock` option.
        if (
          earliestBlock &&
          (fromBlock === "earliest" ||
            (typeof fromBlock === "bigint" && fromBlock < earliestBlock))
        ) {
          fromBlock = earliestBlock;
        }

        // Add logic to split failed requests into multiple smaller requests to
        // accommodate block range and/or event count limits.
        return getEventsWithSplitAndRetry({
          params: {
            fromBlock,
            ...restParams,
          },
          drift: this.drift,
          earliestBlock,
        });
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
