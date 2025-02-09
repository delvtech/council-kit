import { Adapter, ContractReadOptions } from "@delvtech/drift";
import { SdkClient } from "src/drift/SdkClient";

export interface ReadToken<A extends Adapter = Adapter> extends SdkClient<A> {
  address: `0x${string}`;

  /**
   * Get the name of this token
   */
  getName(): Promise<string>;

  /**
   * Get the symbol for this token.
   */
  getSymbol(): Promise<string>;

  /**
   * Get the number of decimal places this token uses.
   */
  getDecimals(): Promise<number>;

  /**
   * Get the spending allowance of a given spender for a given owner of this
   * token.
   */
  getAllowance({
    owner,
    spender,
    options,
  }: {
    owner: `0x${string}`;
    spender: `0x${string}`;
    options?: ContractReadOptions;
  }): Promise<bigint>;

  /**
   * Get the token balance of a given address
   */
  getBalanceOf({
    account,
    options,
  }: {
    account: `0x${string}`;
    options?: ContractReadOptions;
  }): Promise<bigint>;
}
