export interface TokenAPIDataSource {
  getTokenPrice: (id: string, currency: string) => Promise<number | null>;
}
