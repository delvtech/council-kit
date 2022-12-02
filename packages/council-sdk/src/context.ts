import { providers } from "ethers";
import { DataSource } from "./datasources/DataSource";

export interface CouncilContextOptions {
  dataSources?: DataSource[];
}

/**
 * The CouncilContext stores information about the context in which models are
 * created and used including shared data sources and their cache. It also
 * includes a couple utility methods for getting and registering new shared
 * data sources.
 */
export class CouncilContext {
  provider: providers.Provider;
  dataSources: DataSource[];

  constructor(provider: providers.Provider, options?: CouncilContextOptions) {
    this.provider = provider;
    this.dataSources = options?.dataSources || [];
  }

  /**
   * Get a shared `DataSource` who's properties match a given filter object.
   * @param filter - An object of `DataSource` keys and values to look for.
   * @returns The matching `DataSource` if found, else `null`.
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
