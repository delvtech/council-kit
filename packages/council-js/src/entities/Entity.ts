import {
  Adapter,
  Address,
  ContractWriteOptions,
  createDrift,
  Drift,
  OneOf,
  OnMinedParam,
  SimpleCache,
} from "@delvtech/drift";

// Base //

/**
 * Configuration options for an {@link Entity}.
 */
export type EntityConfig<A extends Adapter = Adapter> = OneOf<
  | {
      drift?: Drift<A>;
    }
  | {
      cache?: SimpleCache;
      chainId?: number;
      rpcUrl?: string;
    }
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
