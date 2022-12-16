import { BaseContract, Signer, type ContractTransaction } from "ethers";
import LRUCache from "lru-cache";
import { CouncilContext } from "src";
import { CachedDataSource } from "./CachedDataSource";

/**
 * A DataSource with methods for making cached calls to an ethers contract
 * instance.
 * @see https://docs.ethers.org/v5/api/contract/contract/
 */
// TODO: add a method for event queries
export class ContractDataSource<
  T extends BaseContract,
> extends CachedDataSource {
  address: string;
  contract: T;

  constructor(
    contract: T,
    context: CouncilContext,
    cache?: LRUCache<string, any>,
  ) {
    super(context, cache);
    this.address = contract.address;
    this.contract = contract;
  }

  /**
   * Call a method on the contract and cache the result with a key made from the
   * method name and arguments.
   * @param method The name of the method to call on the contract.
   * @param args The array of arguments to pass to the method.
   * @returns The value returned from the contract.
   * @see https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall
   */
  call<K extends FunctionKeys<T>>(
    method: K,
    args: T[K] extends AnyFunction ? Parameters<T[K]> : never,
  ): T[K] extends AnyFunction ? ReturnType<T[K]> : never {
    return this.cached([method, ...args], () => {
      const contract = this.contract as T;
      const fn = contract[method] as unknown as AnyFunction;
      return fn(...args);
    });
  }

  /**
   * Call a method on the contract using `callStatic` and cache the result with
   * a key made from the method name and arguments.
   * @param method The name of the method to call on the contract.
   * @param args The array of arguments to pass to the method.
   * @returns The value returned from the contract.
   * @see https://docs.ethers.org/v5/api/contract/contract/#contract-callStatic
   */
  callStatic<K extends FunctionKeys<T["callStatic"]>>(
    method: K,
    args: T["callStatic"][K] extends AnyFunction
      ? Parameters<T["callStatic"][K]>
      : never,
  ): ReturnType<T["callStatic"][K]> {
    return this.cached([method, ...args], () => {
      const contract = this.contract as T;
      const fn = contract.callStatic[method as string] as AnyFunction;
      return fn(...args);
    });
  }

  /**
   * Call a write method on the contract with a signer and wait for the
   * transaction to resolve. If the transaction fails, this will throw an error.
   * @param method The name of the write method to call on the contract.
   * @param args The array of arguments to pass to the method.
   * @param signer The Signer to connect to the contract with before calling.
   * @returns A promise that resolves to the {@linkcode ContractTransaction}.
   */
  async callWithSigner<K extends TransactionKeys<T>>(
    method: K,
    args: T[K] extends TransactionFunction ? Parameters<T[K]> : never,
    signer: Signer,
    options?: TransactionOptions,
  ): Promise<ContractTransaction> {
    const contract = this.contract.connect(signer) as T;
    const fn = contract[method] as unknown as TransactionFunction;
    const transaction = await fn(...args);
    options?.onSubmitted?.(transaction.hash);
    await transaction.wait(); // will throw an error if transaction fails
    return transaction;
  }

  /**
   * Delete the cache entry for a call to a given method with the given args.
   * @returns A boolean indicating whether the entry was successfully deleted.
   */
  deleteCall<K extends FunctionKeys<T>>(
    method: K,
    args: T[K] extends AnyFunction ? Parameters<T[K]> : never,
  ): boolean {
    return this.deleteCached([method, ...args]);
  }
}

export interface TransactionOptions {
  /**
   * A function called when the transaction is submitted to the blockchain.
   * @param transaction The transaction hash.
   */
  onSubmitted?: (transaction: string) => void;
}

type AnyFunction = (...args: any) => any;

/**
 * Get a union of all keys/properties on T that are functions
 */
export type FunctionKeys<T> = Exclude<
  {
    [K in keyof T]: T[K] extends AnyFunction ? K : undefined;
  }[keyof T],
  undefined
>;

type TransactionFunction = (
  ...args: any
) => ContractTransaction | Promise<ContractTransaction>;

/**
 * Get a union of all keys/properties on T that are functions and return a
 * `ContractTransaction`.
 */
export type TransactionKeys<T> = Exclude<
  {
    [K in keyof T]: T[K] extends TransactionFunction ? K : undefined;
  }[keyof T],
  undefined
>;
