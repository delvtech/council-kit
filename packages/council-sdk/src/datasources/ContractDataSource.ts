import { BaseContract, Signer } from "ethers";
import LRUCache from "lru-cache";
import { CouncilContext } from "..";
import { CachedDataSource } from "./CachedDataSource";

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

export interface TransactionOptions {
  onSubmitted?: (transaction: string) => void;
}

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

  call<K extends FunctionKeys<T>>(
    property: K,
    args: T[K] extends AnyFunction ? Parameters<T[K]> : never,
  ): T[K] extends AnyFunction ? ReturnType<T[K]> : never {
    return this.cached([property, ...args], () => {
      const contract = this.contract as T;
      const fn = contract[property] as unknown as AnyFunction;
      return fn(...args);
    });
  }

  callStatic<K extends FunctionKeys<T["callStatic"]>>(
    property: K,
    args: T["callStatic"][K] extends AnyFunction
      ? Parameters<T["callStatic"][K]>
      : never,
  ): T["callStatic"][K] extends AnyFunction
    ? ReturnType<T["callStatic"][K]>
    : never {
    return this.cached([property, ...args], () => {
      const contract = this.contract as T;
      const fn = contract.callStatic[property as string] as AnyFunction;
      return fn(...args);
    });
  }

  async callWithSigner<K extends FunctionKeys<T>>(
    method: K,
    args: T[K] extends AnyFunction ? Parameters<T[K]> : never,
    signer: Signer,
    options?: TransactionOptions,
  ): Promise<T[K] extends AnyFunction ? Awaited<ReturnType<T[K]>> : never> {
    const contract = this.contract.connect(signer) as T;
    const fn = contract[method] as unknown as AnyFunction;
    const transaction = await fn(...args);
    options?.onSubmitted?.(transaction.hash);
    await transaction.wait(); // will throw an error if transaction fails
    return transaction;
  }

  deleteCall<K extends FunctionKeys<T>>(
    property: K,
    args: T[K] extends AnyFunction ? Parameters<T[K]> : never,
  ): boolean {
    return this.deleteCached([property, ...args]);
  }
}
