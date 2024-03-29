import {
  CreateCachedReadContractOptions,
  CreateCachedReadWriteContractOptions,
  Network,
} from "@delvtech/evm-client";
import {
  ReadContractFactory,
  ReadWriteContractFactory,
} from "src/contract/factory";

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
  contractFactory: ReadContractFactory;
}

/**
 * A base class for read-only models.
 * @category Models
 */
export class Model {
  name: string;
  network: Network;
  contractFactory: ReadContractFactory;

  constructor({ name, network, contractFactory }: ReadModelOptions) {
    this.name = name ?? this.constructor.name;
    this.network = network;
    this.contractFactory = contractFactory;
  }
}

/**
 * @category Models
 */
export interface ReadWriteModelOptions extends ModelOptions {
  contractFactory: ReadWriteContractFactory;
}

// Contract models

/**
 * @category Models
 */
export interface ReadContractModelOptions
  extends ReadModelOptions,
    Omit<CreateCachedReadContractOptions, "contract"> {
  address: `0x${string}`;
}

/**
 * @category Models
 */
export interface ReadWriteContractModelOptions
  extends ReadWriteModelOptions,
    Omit<CreateCachedReadWriteContractOptions, "contract"> {
  address: `0x${string}`;
}
