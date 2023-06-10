import { Signer } from "ethers";
import { CouncilContext } from "src/context/context";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { MockERC20ContractDataSource } from "src/datasources/token/MockERC20ContractDataSource";
import { Token, TokenOptions } from "./Token";

export interface MockTokenOptions extends TokenOptions {
  dataSource?: MockERC20ContractDataSource;
}

export class MockToken extends Token<MockERC20ContractDataSource> {
  constructor(
    address: string,
    context: CouncilContext,
    options?: TokenOptions,
  ) {
    super(address, context, {
      ...options,
      name: options?.name ?? "Mock Token",
      dataSource:
        options?.dataSource ||
        context.registerDataSource(
          { address },
          new MockERC20ContractDataSource(address, context),
        ),
    });
  }

  /**
   * Mint new tokens
   * @param signer - Signer.
   * @param account - The account to add tokens to.
   * @param amount - The amount of tokens (as a decimal string) to add.
   * @return - The transaction hash.
   */
  mint(
    signer: Signer,
    account: string,
    amount: string,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.mint(signer, account, amount, options);
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
    return this.dataSource.setBalance(signer, account, balance, options);
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
    return this.dataSource.setAllowance(
      signer,
      owner,
      spender,
      allowance,
      options,
    );
  }
}
