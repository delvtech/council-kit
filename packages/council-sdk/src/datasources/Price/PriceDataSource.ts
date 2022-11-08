export interface PriceDataSource {
  getERC20FiatPrice: (
    address: string,
    currency: string,
  ) => Promise<number | null>;
}
