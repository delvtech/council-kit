import { Abi } from "abitype";
import {
  EventName,
  FunctionArgs,
  FunctionName,
  FunctionReturnType,
} from "src/base/abitype";
import { LruSimpleCache } from "src/cache/LruSimpleCache";
import { SimpleCache, SimpleCacheKey } from "src/cache/SimpleCache";
import { createSimpleCacheKey } from "src/cache/utils/createSimpleCacheKey";
import {
  ContractEvent,
  ContractGetEventsOptions,
} from "src/contract/ContractEvents";
import { ContractReadOptions, ReadContract } from "src/contract/ReadContract";
import { ContractWriteOptions } from "src/contract/ReadWriteContract";

// TODO: Figure out a good default cache size
const DEFAULT_CACHE_SIZE = 100;

export interface CachedReadContractOptions<TAbi extends Abi = Abi> {
  contract: ReadContract<TAbi>;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

/**
 * A wrapped Ethereum contract reader that provides caching capabilities. Useful
 * for reducing the number of actual reads from a contract by caching and
 * reusing previous read results.
 *
 * @example
 * const cachedContract = new CachedReadContract({ contract: myContract });
 * const result1 = await cachedContract.read("functionName", args);
 * const result2 = await cachedContract.read("functionName", args); // Fetched from cache
 */
export class CachedReadContract<TAbi extends Abi = Abi>
  implements ReadContract<TAbi>
{
  namespace: string;
  abi: TAbi;
  address: `0x${string}`;

  protected _contract: ReadContract<TAbi>;
  protected _cache: SimpleCache;

  constructor({ contract, cache, namespace }: CachedReadContractOptions<TAbi>) {
    this.namespace = namespace || "";
    this.abi = contract.abi;
    this.address = contract.address;
    this._contract = contract;
    this._cache = cache || new LruSimpleCache({ max: DEFAULT_CACHE_SIZE });
  }

  /**
   * Reads data from the contract. First checks the cache, and if not present,
   * fetches from the contract and then caches the result.
   */
  async read<TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>>(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ): Promise<FunctionReturnType<TAbi, TFunctionName>> {
    return this._getOrSet({
      key: createSimpleCacheKey([
        this.namespace,
        "read",
        {
          address: this.address,
          functionName,
          args,
          options,
        },
      ]),

      callback: () => this._contract.read(functionName, args, options),
    });
  }

  /**
   * Deletes a specific read from the cache.
   *
   * @example
   * const cachedContract = new CachedReadContract({ contract: myContract });
   * const result1 = await cachedContract.read("functionName", args);
   * const result2 = await cachedContract.read("functionName", args); // Fetched from cache
   *
   * cachedContract.deleteRead("functionName", args);
   * const result3 = await cachedContract.read("functionName", args); // Fetched from contract
   */
  deleteRead<TFunctionName extends FunctionName<TAbi>>(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ): void {
    const key = createSimpleCacheKey([
      this.namespace,
      "read",
      {
        address: this.address,
        functionName,
        args,
        options,
      },
    ]);

    this._cache.delete(key);
  }

  /**
   * Gets events from the contract. First checks the cache, and if not present,
   * fetches from the contract and then caches the result.
   */
  async getEvents<TEventName extends EventName<TAbi>>(
    eventName: TEventName,
    options?: ContractGetEventsOptions<TAbi, TEventName>,
  ): Promise<ContractEvent<TAbi, TEventName>[]> {
    return this._getOrSet({
      key: createSimpleCacheKey([
        this.namespace,
        "getEvents",
        {
          address: this.address,
          eventName,
          options,
        },
      ]),
      callback: () => this._contract.getEvents(eventName, options),
    });
  }

  /**
   * Clears the entire cache.
   */
  clearCache(): void {
    this._cache.clear();
  }

  /**
   * Simulates a contract write operation. This method directly delegates
   * to the underlying contract without interacting with the cache.
   */
  simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    fn: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ): Promise<FunctionReturnType<TAbi, TFunctionName>> {
    return this._contract.simulateWrite(fn, args, options);
  }

  /**
   * Retrieves a value from the cache or sets it if not present.
   */
  private async _getOrSet<TValue = any>({
    key,
    callback,
  }: {
    key: SimpleCacheKey;
    callback: () => Promise<TValue> | TValue;
  }): Promise<TValue> {
    let value = this._cache.get(key);
    if (value) {
      return value;
    }

    value = await callback();
    this._cache.set(key, value);

    return value;
  }
}
