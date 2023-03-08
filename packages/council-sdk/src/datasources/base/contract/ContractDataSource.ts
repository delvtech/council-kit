import { TypedEvent, TypedEventFilter } from "@council/typechain/dist/common";
import {
  Contract,
  ContractReceipt,
  ethers,
  Signer,
  type ContractTransaction,
} from "ethers";
import { Logger } from "ethers/lib/utils";
import LRUCache from "lru-cache";
import { CouncilContext } from "src";
import { CachedDataSource } from "src/datasources/base/cached/CachedDataSource";

/**
 * A DataSource with methods for making cached calls to an ethers contract
 * instance.
 * @see https://docs.ethers.org/v5/api/contract/contract/
 * @category Data Sources
 */
// TODO: add a method for event queries
export class ContractDataSource<T extends Contract> extends CachedDataSource {
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
   * @param method - The name of the method to call on the contract.
   * @param args - The array of arguments to pass to the method.
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
   * @param method - The name of the method to call on the contract.
   * @param args - The array of arguments to pass to the method.
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
   * @param method - The name of the write method to call on the contract.
   * @param args - The array of arguments to pass to the method.
   * @param signer - The Signer to connect to the contract with before calling.
   * @returns A promise that resolves to the `ContractTransaction`.
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

    try {
      await transaction.wait(); // will throw an error if transaction fails
    } catch (error: unknown) {
      if (isTransactionReplacedError(error)) {
        if (error.reason === "cancelled" && options?.onCancelled) {
          options.onCancelled(transaction.hash);
          return transaction;
        }
        if (error.reason === "repriced" && options?.onRepriced) {
          options.onRepriced(transaction.hash);
          return transaction;
        }
      }

      // null is an object, but isn't truthy
      if (error && typeof error === "object") {
        throw error;
      }

      if (typeof error === "string") {
        throw new Error(error);
      }

      throw new Error(
        `Unknown error calling ${method as string} on: ${
          this.contract.address
        } with arguments: ${args}`,
      );
    }

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

  /**
   * Get events from the contract and cache the results with a key made from the
   * filter and block range. If the request fails, the block range will be split
   * in 2 recursively until all events within the requested range are fetched.
   * @param filter - The TypedEventFilter of the event to fetch.
   * @param fromBlock - Include all events on or after this block.
   * @param toBlock - Include all events on or before this block.
   */
  getEvents<TEvent extends TypedEvent>(
    filter: TypedEventFilter<TEvent>,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<TEvent[]> {
    return this.cached(["getEvents", filter, fromBlock, toBlock], async () => {
      const start = fromBlock ?? 0;
      const end = toBlock ?? (await this.context.provider.getBlockNumber());
      const blockRange = end - start;
      try {
        // TODO: find a better solution for this.
        // ethers.js will spit out an error message that we can't disable without turning off the
        // logger.  because the smart contract code for queryVotePower returns an error if the
        // account is not found, it can flood the console with errors.  this is a workaround until a
        // better solution is found.
        ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.OFF);
        const events = await this.contract.queryFilter(
          filter,
          fromBlock,
          toBlock,
        );
        ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.WARNING);
        return events as TEvent[];
      } catch (err) {
        const midPoint = start + Math.floor(blockRange / 2);
        const firstHalf = await this.getEvents(filter, start, midPoint);
        const secondHalf = await this.getEvents(filter, midPoint + 1, end);

        return [...firstHalf, ...secondHalf] as TEvent[];
      }
    });
  }
}

/**
 * @category Data Sources
 */
export interface TransactionOptions {
  /**
   * A function called when the transaction is submitted to the blockchain.
   * @param transaction - The transaction hash.
   */
  onSubmitted?: (transaction: string) => void;

  /**
   * A function called when the transaction is canceled.
   * @param transaction - The transaction hash.
   */
  onCancelled?: (transaction: string) => void;

  /**
   * A function called when the transaction is repriced.
   * @param transaction - The transaction hash.
   */
  onRepriced?: (transaction: string) => void;
}

export type AnyFunction = (...args: any) => any;

/**
 * Get a union of all keys/properties on T that are functions.
 * @category Data Sources
 */
export type FunctionKeys<T> = Exclude<
  {
    [K in keyof T]: T[K] extends AnyFunction ? K : undefined;
  }[keyof T],
  undefined
>;

export type TransactionFunction = (
  ...args: any
) => ContractTransaction | Promise<ContractTransaction>;

/**
 * Get a union of all keys/properties on T that are functions and return a
 * `ContractTransaction`.
 * @category Data Sources
 */
export type TransactionKeys<T> = Exclude<
  {
    [K in keyof T]: T[K] extends TransactionFunction ? K : undefined;
  }[keyof T],
  undefined
>;

/**
 * @category Data Sources
 */
export interface TransactionReplacedError extends Error {
  code: "TRANSACTION_REPLACED";
  // The reason why the transaction was replaced
  // - "repriced" is generally nothing of concern, the
  //   only difference in the transaction is the gasPrice
  // - "cancelled" means the `to` has been set to the `from`,
  //   the data has been set to `0x` and value set to 0
  // - "replaced" means that the transaction is unrelated to
  //   the original transaction
  reason: "repriced" | "cancelled" | "replaced";
  // This is a short-hand property as the effects of either a
  // "cancelled" or "replaced" tx are effectively cancelled
  cancelled: boolean;
  // The TransactionResponse which replaced the original
  replacement: ContractTransaction;
  // The TransactionReceipt of the replacement transaction
  receipt: ContractReceipt;
}

function isTransactionReplacedError(
  error: TransactionReplacedError | any,
): error is TransactionReplacedError {
  if (error?.code === Logger.errors.TRANSACTION_REPLACED) {
    return true;
  }
  return false;
}
