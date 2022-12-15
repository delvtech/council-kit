import { BigNumber, Signer } from "ethers";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { DataSource } from "src/datasources/DataSource";

/**
 * An interface for fetching data from any token.
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
   * @param {Signer} signer - Signer.
   * @param {string} spender - Address to approve access to.
   * @param {string} [amount] - Amount approved for, defaults to maximum.
   * @return {Promise<string>} - The transaction hash.
   */
  approve: (
    signer: Signer,
    spender: string,
    amount: BigNumber,
    options?: TransactionOptions,
  ) => Promise<string>;
}
