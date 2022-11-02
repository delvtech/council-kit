import { DataSource } from "./datasources/DataSource";

export interface CouncilContextOptions {}

export class CouncilContext {
  dataSources: DataSource[] = [];

  constructor(options: CouncilContextOptions) {}

  // TODO: How can we make this more efficient, yet still flexible
  getDataSource<T extends Record<string, any>>(filter: Partial<T>): T | null {
    const dataSource = this.dataSources.find((dataSource) => {
      let isMatch = true;
      for (const [key, value] of Object.entries(filter)) {
        if (!dataSource[key] !== value) {
          isMatch = false;
        }
      }
      return isMatch;
    });
    return (dataSource as T) ?? null;
  }

  registerDataSource<T extends Record<string, any>>(
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
