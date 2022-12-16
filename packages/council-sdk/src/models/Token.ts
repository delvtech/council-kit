import { Signer } from "ethers";
import { CouncilContext } from "src/context";
import { ERC20ContractDataSource } from "src/datasources/Token/ERC20ContractDataSource";
import { TokenDataSource } from "src/datasources/Token/TokenDataSource";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { Model } from "./Model";
import { parseUnits } from "ethers/lib/utils";

export class Token extends Model {
  address: string;
  dataSource: TokenDataSource;

  constructor(
    address: string,
    context: CouncilContext,
    dataSource?: TokenDataSource,
  ) {
    super(context);
    this.address = address;
    this.dataSource =
      dataSource ||
      context.registerDataSource(
        { address },
        new ERC20ContractDataSource(address, context),
      );
  }

  /**
   * Get the symbol for this token.
   */
  getSymbol(): Promise<string> {
    return this.dataSource.getSymbol();
  }

  /**
   * Get the number of decimal places this token uses.
   */
  getDecimals(): Promise<number> {
    return this.dataSource.getDecimals();
  }

  /**
   * Get the name of this token
   */
  getName(): Promise<string> {
    return this.dataSource.getName();
  }

  /**
   * Get the spending allowance of a given spender for a given owner of this
   * token.
   */
  getAllowance(owner: string, spender: string): Promise<string> {
    return this.dataSource.getAllowance(owner, spender);
  }

  /**
   * Get the token balance of a given address
   */
  getBalanceOf(address: string): Promise<string> {
    return this.dataSource.getBalanceOf(address);
  }

  /**
   * Give a spending allowance to a given spender.
   * @param signer The Signer of the owner.
   * @param spender The address of the spender.
   * @param amount The amount of tokens the spender can spend.
   * @returns The transaction hash.
   */
  async approve(
    signer: Signer,
    spender: string,
    amount: string,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.approve(
      signer,
      spender,
      parseUnits(amount, await this.getDecimals()),
      options,
    );
  }
}
