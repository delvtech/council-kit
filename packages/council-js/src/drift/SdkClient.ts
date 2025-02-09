import {
  Adapter,
  Address,
  ClientConfig,
  ContractWriteOptions,
  createDrift,
  Drift,
  OneOf,
  OnMinedParam,
} from "@delvtech/drift";

// Base //

/**
 * Configuration options for an {@link SdkClient}.
 */
export type SdkClientConfig<A extends Adapter = Adapter> = OneOf<
  | {
      drift?: Drift<A>;
    }
  | ClientConfig<A>
> & {
  /**
   * An arbitrary name for the instance. This is for convenience only (e.g., for
   * use as a display name or in logging) and has no affect on the client's
   * behavior.
   */
  debugName?: string;

  /**
   * The earliest block to fetch events from.
   */
  earliestBlock?: bigint;
};

/**
 * A base class for SDK clients.
 */
export class SdkClient<A extends Adapter = Adapter> {
  drift: Drift<A>;
  debugName: string;

  constructor({
    debugName,
    drift,
    earliestBlock,
    ...driftConfig
  }: SdkClientConfig<A> = {}) {
    this.debugName = debugName ?? this.constructor.name;
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
 * Params for write operations on an {@linkcode SdkClient}.
 *
 * @template Args Additional parameters for the write operation.
 */
export type SdkWriteParams<Args> = {
  args: Args;
  options?: ContractWriteOptions & OnMinedParam;
};

// Contract //

/**
 * Additional options required for clients that represent a specific contract.
 */
export interface SdkContractOptions {
  /**
   * The address of the contract.
   */
  address: Address;
}

/**
 * Configuration options for an {@linkcode SdkClient} that represents a specific
 * contract.
 */
export type SdkContractConfig<A extends Adapter = Adapter> =
  SdkClientConfig<A> & SdkContractOptions;
