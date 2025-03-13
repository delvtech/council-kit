import {
  Adapter,
  Address,
  ContractWriteOptions,
  Drift,
  DriftConfig,
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
  | DriftConfig<A>
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

  constructor({
    drift,
    earliestBlock = 0n,
    ...driftConfig
  }: EntityConfig<A> = {}) {
    this.drift = drift || createDrift(driftConfig);
    this.drift.extend({
      getEvents({
        fromBlock = earliestBlock,
        toBlock = "latest",
        ...restParams
      }) {
        // Overwrite `fromBlock` if earlier than the `earliestBlock` option.
        if (
          earliestBlock !== undefined &&
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
            toBlock,
            ...restParams,
          },
          drift: this,
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
