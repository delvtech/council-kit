import { providers } from "ethers";
import { DataSource } from "./datasources/DataSource";

/**
 * @category Context
 */
export interface CouncilContextOptions {
  dataSources?: DataSource[];
}

/**
 * The Context stores common information used in model and data source methods
 * including shared data sources and their cache. It also includes a couple
 * utility methods for getting and registering new shared data sources.
 * @category Context
 */
export class CouncilContext {
  /**
   * The [ethers Provider](https://docs.ethers.org/v5/api/providers/) instance
   * being used by data sources to fetch data from the blockchain.
   */
  provider: providers.Provider;

  /**
   * A shared array of `DataSource` instances and their caches that will be
   * reused by models. When a new model instance is created, it will add any
   * missing data source instances it requires to this list.
   */
  dataSources: DataSource[];

  /**
   * Create a new CouncilContext instance.
   * @param provider - An [ethers Provider](https://docs.ethers.org/v5/api/providers/)
   *   instance.
   */
  constructor(provider: providers.Provider, options?: CouncilContextOptions) {
    this.provider = provider;
    this.dataSources = options?.dataSources || [];
  }

  /**
   * Get a shared `DataSource` who's properties match a given filter object.
   * @param filter - An object of `DataSource` keys and values to look for.
   * @returns The first `DataSource` instance in the `dataSources` array that
   * matches the `filter`, or `null` if no match is found.
   */
  // TODO: How can we make this more efficient, yet still flexible
  getDataSource<T extends DataSource>(filter: Partial<T>): T | null {
    const dataSource = this.dataSources.find((dataSource) => {
      let isMatch = true;
      for (const [key, value] of Object.entries(filter)) {
        if (dataSource[key as keyof DataSource] !== value) {
          isMatch = false;
        }
      }
      return isMatch;
    });
    return (dataSource as T) ?? null;
  }

  /**
   * Add a new shared `DataSource` if one matching a given filter object
   * doesn't already exist.
   * @param filter - An object of `DataSource` keys and values to look for.
   * @param dataSource - The `DataSource` to add if one matching the filter
   *   isn't found.
   * @returns The matching `DataSource` if found, else the added `DataSource`.
   */
  registerDataSource<T extends DataSource>(
    filter: Partial<T>,
    dataSource: T,
  ): T {
    const existing = this.getDataSource(filter);
    if (existing) {
      return existing;
    }
    this.dataSources.push(dataSource);
    return dataSource;
  }
}
