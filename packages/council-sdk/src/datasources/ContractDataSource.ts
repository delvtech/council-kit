import { BaseContract } from "ethers";
import LRUCache from "lru-cache";
import { CachedDataSource } from "./CachedDataSource";

type AnyFunction = (...args: any) => any;

/**
 * Get a union of all keys/properties on T that are functions
 */
export type FunctionKeys<T> = Exclude<
  {
    [K in keyof T]: T[K] extends AnyFunction ? K : never;
  }[keyof T],
  undefined
>;

// TODO: add a method for event queries
export class ContractDataSource<
  T extends BaseContract,
> extends CachedDataSource {
  address: string;
  contract: T;

  constructor(contract: T, cache?: LRUCache<string, any>) {
    super(cache);
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
}
