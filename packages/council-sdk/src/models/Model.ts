import {
  CachedReadContractOptions,
  CachedReadWriteContractOptions,
  Network,
} from "@council/evm-client";
import {
  CachedReadContractFactory,
  CachedReadWriteContractFactory,
} from "src/contract/factory";

/**
 * A base class for read-only models.
 * @category Models
 */
export class Model {
  name: string;
  protected _network: Network;
  protected _contractFactory: CachedReadContractFactory;

  constructor({ name, network, contractFactory }: ReadModelOptions) {
    this.name = name ?? this.constructor.name;
    this._network = network;
    this._contractFactory = contractFactory;
  }
}

interface ModelOptions {
  network: Network;
  /**
   * An arbitrary name for the instance. This is for convenience only (e.g.,
   * display name, debugging) and has no affect on the model's behavior.
   */
  name?: string;
}

/**
 * @category Models
 */
export interface ReadModelOptions extends ModelOptions {
  contractFactory: CachedReadContractFactory;
}

/**
 * @category Models
 */
export interface ReadContractModelOptions
  extends ReadModelOptions,
    Omit<CachedReadContractOptions, "contract"> {
  address: `0x${string}`;
}

/**
 * @category Models
 */
export interface ReadWriteModelOptions extends ModelOptions {
  contractFactory: CachedReadWriteContractFactory;
}

/**
 * @category Models
 */
export interface ReadWriteContractModelOptions
  extends ReadWriteModelOptions,
    Omit<CachedReadWriteContractOptions, "contract"> {
  address: `0x${string}`;
}
