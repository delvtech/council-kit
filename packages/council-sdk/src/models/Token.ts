import { ethers, Signer } from "ethers";
import { CouncilContext } from "src/context";
import { ERC20ContractDataSource } from "src/datasources/Token/ERC20ContractDataSource";
import { TokenDataSource } from "src/datasources/Token/TokenDataSource";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { Model } from "./Model";

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
        new ERC20ContractDataSource(address, context.provider),
      );
  }

  getSymbol(): Promise<string> {
    return this.dataSource.getSymbol();
  }

  getDecimals(): Promise<number> {
    return this.dataSource.getDecimals();
  }

  getName(): Promise<string> {
    return this.dataSource.getName();
  }

  getAllowance(owner: string, spender: string): Promise<string> {
    return this.dataSource.getAllowance(owner, spender);
  }

  getBalanceOf(address: string): Promise<string> {
    return this.dataSource.getBalanceOf(address);
  }

  approve(
    signer: Signer,
    spender: string,
    amount: string,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.approve(signer, spender, amount, options);
  }
}
