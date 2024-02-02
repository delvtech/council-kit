import { Abi } from "abitype";
import { LruSimpleCache } from "src/cache/implementations/LruSimpleCache";
import { SimpleCache, SimpleCacheKey } from "src/cache/types/SimpleCache";
import { createSimpleCacheKey } from "src/cache/utils/createSimpleCacheKey";
import {
  ContractDecodeFunctionDataArgs,
  ContractEncodeFunctionDataArgs,
  ContractGetEventsArgs,
  ContractReadArgs,
  ContractWriteArgs,
  ReadContract,
} from "src/contract/types/Contract";
import { Event, EventName } from "src/contract/types/Event";
import {
  DecodedFunctionData,
  FunctionName,
  FunctionReturn,
} from "src/contract/types/Function";

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
  abi: TAbi;
  address: `0x${string}`;
  contract: ReadContract<TAbi>;
  cache: SimpleCache;
  namespace: string;

  constructor({ contract, cache, namespace }: CachedReadContractOptions<TAbi>) {
    this.abi = contract.abi;
    this.address = contract.address;
    this.contract = contract;
    this.cache = cache || new LruSimpleCache({ max: DEFAULT_CACHE_SIZE });
    this.namespace = namespace || "";
  }

  /**
   * Reads data from the contract. First checks the cache, and if not present,
   * fetches from the contract and then caches the result.
   */
  async read<TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>>(
    ...[functionName, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
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

      callback: () => this.contract.read(functionName, args, options),
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
    ...[functionName, args, options]: ContractReadArgs<TAbi, TFunctionName>
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

    this.cache.delete(key);
  }

  /**
   * Gets events from the contract. First checks the cache, and if not present,
   * fetches from the contract and then caches the result.
   */
  async getEvents<TEventName extends EventName<TAbi>>(
    ...[eventName, options]: ContractGetEventsArgs<TAbi, TEventName>
  ): Promise<Event<TAbi, TEventName>[]> {
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
      callback: () => this.contract.getEvents(eventName, options),
    });
  }

  /**
   * Clears the entire cache.
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Simulates a contract write operation. This method directly delegates
   * to the underlying contract without interacting with the cache.
   */
  simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[functionName, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this.contract.simulateWrite(functionName, args, options);
  }

  encodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    ...[functionName, args]: ContractEncodeFunctionDataArgs<TAbi, TFunctionName>
  ): `0x${string}` {
    return this.contract.encodeFunctionData(functionName, args);
  }

  decodeFunctionData<
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    ...[functionName, data]: ContractDecodeFunctionDataArgs<TAbi, TFunctionName>
  ): DecodedFunctionData<TAbi, TFunctionName> {
    return this.contract.decodeFunctionData(functionName, data);
  }

  /**
   * Retrieves a value from the cache or sets it if not present.
   */
  private async _getOrSet<TValue>({
    key,
    callback,
  }: {
    key: SimpleCacheKey;
    callback: () => Promise<TValue> | TValue;
  }): Promise<TValue> {
    let value = this.cache.get(key);
    if (value) {
      return value;
    }

    value = await callback();
    this.cache.set(key, value);

    return value;
  }
}
