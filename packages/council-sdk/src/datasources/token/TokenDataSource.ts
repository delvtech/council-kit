import { Signer } from "ethers";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { DataSource } from "src/datasources/base/DataSource";

/**
 * An interface for fetching data from any token.
 * @category Data Sources
 */
export interface TokenDataSource extends DataSource {
  address: string;

  /**
   * Get the symbol of this token, usually a shorter version of the name.
   */
  getSymbol: () => Promise<string>;

  /**
   * Get the name of this token.
   */
  getName: () => Promise<string>;

  /**
   * Get the number of decimals used to format a balance for display. For
   * example, if decimals equals 2, a balance of `505` tokens should be
   * displayed as `5.05` (`505 / 10 ** 2`).
   */
  getDecimals: () => Promise<number>;

  /**
   * Get the spending allowance of a given spender for a given owner of this
   * token.
   */
  getAllowance: (owner: string, spender: string) => Promise<string>;

  /**
   * Get the amount of tokens owned by a given address.
   */
  getBalanceOf: (address: string) => Promise<string>;

  /**
   * Sets approval of token access up to a certain amount
   * @param signer - Signer.
   * @param spender - Address to approve access to.
   * @param amount - Amount approved for (as a decimal string), defaults to maximum.
   * @return - The transaction hash.
   */
  approve: (
    signer: Signer,
    spender: string,
    amount: string,
    options?: TransactionOptions,
  ) => Promise<string>;
}
