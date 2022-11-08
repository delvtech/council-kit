import { HTTPDataSource } from "src/datasources/HTTPDataSource";
import { TokenPriceDataSource } from "./TokenPriceDataSource";

const BASE_URL = "https://api.coingecko.com/api/v3/";

export class CoinGeckoAPIDataSource
  extends HTTPDataSource
  implements TokenPriceDataSource
{
  static baseURL = BASE_URL;

  constructor() {
    super(BASE_URL);
  }

  // TODO: Add strong types for CODE and possibly ID
  async getTokenPrice<ID extends string, CODE extends string>(
    id: ID,
    currency: CODE,
  ): Promise<number | null> {
    type TokenPriceResponse = Record<ID, Record<CODE, number> | undefined>;
    const res = await this.get<TokenPriceResponse>(
      `/simple/price?ids=${id}&vs_currencies=${currency ?? "usd"}`,
    );
    return res[id]?.[currency] ?? null;
  }
}
