import { ContractWriteOptions } from "@council/evm-client";
import { ReadWriteToken } from "./Token";

export class ReadWriteMockToken extends ReadWriteToken {
  /**
   * Mint new tokens
   * @param account - The account to add tokens to.
   * @param amount - The amount of tokens (as a decimal string) to add.
   * @return - The transaction hash.
   */
  async mint({
    account,
    amount,
    options,
  }: {
    account: `0x${string}`;
    amount: bigint;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this._contract.write(
      "mint",
      {
        account,
        amount,
      },
      options,
    );
    this._contract.deleteRead("balanceOf", account);
    return hash;
  }

  /**
   * Modify an account's balance.
   * @param account - The account to set balance for.
   * @param balance - The new balance (as a decimal string) for the account.
   * @return - The transaction hash.
   */
  async setBalance({
    account,
    balance,
    options,
  }: {
    account: `0x${string}`;
    balance: bigint;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this._contract.write(
      "setBalance",
      {
        who: account,
        amount: balance,
      },
      options,
    );
    this._contract.deleteRead("balanceOf", account);
    return hash;
  }

  /**
   * Modify an account's allowance.
   * @param account - The address of the owner to set allowance for.
   * @param spender - The address of the spender to set allowance for.
   * @param balance - The new balance (as a decimal string) for the account.
   * @return - The transaction hash.
   */
  async setAllowance({
    owner,
    spender,
    allowance,
    options,
  }: {
    owner: `0x${string}`;
    spender: `0x${string}`;
    allowance: bigint;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this._contract.write(
      "setAllowance",
      {
        amount: allowance,
        source: owner,
        spender,
      },
      options,
    );
    this._contract.deleteRead("allowance", {
      0: owner,
      1: spender,
    });
    return hash;
  }
}
