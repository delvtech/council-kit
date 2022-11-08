import { HTTPDataSource } from "src/datasources/HTTPDataSource";
import { PriceDataSource } from "./PriceDataSource";

const BASE_URL = "https://api.coingecko.com/api/v3/";

export class CoinGeckoAPIDataSource
  extends HTTPDataSource
  implements PriceDataSource
{
  static baseURL = BASE_URL;

  constructor() {
    super(BASE_URL);
  }

  // TODO: Add strong types for CODE and possibly ID
  async getERC20FiatPrice<TCurrencyCode extends string>(
    address: string,
    currency: TCurrencyCode,
  ): Promise<number | null> {
    // TODO: get code id from address;
    // type TokenPriceResponse = Record<string, Record<TCurrencyCode, number> | undefined>;
    // const res = await this.get<TokenPriceResponse>(
    //   `/simple/price?ids=${id}&vs_currencies=${currency ?? "usd"}`,
    // );
    // return res[id]?.[currency] ?? null;
    return 5;
  }
}
