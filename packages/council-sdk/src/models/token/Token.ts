import { Signer } from "ethers";
import { CouncilContext } from "src/context/context";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { ERC20ContractDataSource } from "src/datasources/token/ERC20ContractDataSource";
import { TokenDataSource } from "src/datasources/token/TokenDataSource";
import { Model, ModelOptions } from "src/models/Model";

/**
 * @category Models
 */
export interface TokenOptions<
  TDataSource extends TokenDataSource = TokenDataSource,
> extends ModelOptions {
  /**
   * A data source to use instead of registering one with the `context`. If you
   * pass in a data source, you take over the responsibility of registering it
   * with the `context` to make it available to other models and data sources.
   */
  dataSource?: TDataSource;
}

/**
 * @category Models
 */
export class Token<
  TDataSource extends TokenDataSource = TokenDataSource,
> extends Model {
  address: string;
  dataSource: TDataSource;

  constructor(
    address: string,
    context: CouncilContext,
    options?: TokenOptions,
  ) {
    super(context, options);
    this.address = address;
    this.dataSource = (options?.dataSource ||
      context.registerDataSource(
        { address },
        new ERC20ContractDataSource(address, context),
      )) as TDataSource;
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
   * @param signer - The Signer of the owner.
   * @param spender - The address of the spender.
   * @param amount - The amount of tokens the spender can spend.
   * @returns The transaction hash.
   */
  async approve(
    signer: Signer,
    spender: string,
    amount: string,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.approve(signer, spender, amount, options);
  }
}
