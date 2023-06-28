import { Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { ERC20ContractDataSource } from "./ERC20ContractDataSource";

/**
 * @category Data Sources
 */
export class MockERC20ContractDataSource extends ERC20ContractDataSource {
  /**
   * Mint new tokens
   * @param signer - Signer.
   * @param account - The account to add tokens to.
   * @param amount - The amount of tokens (as a decimal string) to add.
   * @return - The transaction hash.
   */
  async mint(
    signer: Signer,
    account: string,
    amount: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const decimals = await this.getDecimals();

    const transaction = await this.callWithSigner(
      "mint",
      [account, parseUnits(amount, decimals)],
      signer,
      options,
    );
    this.deleteCall("balanceOf", [account]);

    return transaction.hash;
  }

  /**
   * Modify an account's balance.
   * @param signer - Signer.
   * @param account - The account to set balance for.
   * @param balance - The new balance (as a decimal string) for the account.
   * @return - The transaction hash.
   */
  async setBalance(
    signer: Signer,
    account: string,
    balance: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const decimals = await this.getDecimals();

    const transaction = await this.callWithSigner(
      "setBalance",
      [account, parseUnits(balance, decimals)],
      signer,
      options,
    );
    this.deleteCall("balanceOf", [account]);

    return transaction.hash;
  }

  /**
   * Modify an account's allowance.
   * @param signer - Signer.
   * @param account - The address of the owner to set allowance for.
   * @param spender - The address of the spender to set allowance for.
   * @param balance - The new balance (as a decimal string) for the account.
   * @return - The transaction hash.
   */
  async setAllowance(
    signer: Signer,
    owner: string,
    spender: string,
    allowance: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const decimals = await this.getDecimals();

    const transaction = await this.callWithSigner(
      "setAllowance",
      [owner, spender, parseUnits(allowance, decimals)],
      signer,
      options,
    );
    this.deleteCall("allowance", [owner, spender]);

    return transaction.hash;
  }
}
