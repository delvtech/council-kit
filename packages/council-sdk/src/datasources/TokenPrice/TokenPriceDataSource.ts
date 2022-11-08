export interface TokenPriceDataSource {
  getTokenPrice: (id: string, currency: string) => Promise<number | null>;
}
