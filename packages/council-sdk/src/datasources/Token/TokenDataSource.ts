import { Signer } from "ethers";

export interface TokenDataSource {
  address: string;
  getSymbol: () => Promise<string>;
  getDecimals: () => Promise<number>;
  getName: () => Promise<string>;
  getAllowance: (owner: string, spender: string) => Promise<string>;
  getBalanceOf: (address: string) => Promise<string>;
  approve: (
    signer: Signer,
    spender: string,
    amount: string,
  ) => Promise<boolean>;
}
