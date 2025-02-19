import { Adapter, Contract, ContractReadOptions } from "@delvtech/drift";
import { erc20 } from "@delvtech/drift/testing";
import { Address } from "abitype";
import { ContractEntityConfig, Entity } from "src/entities/Entity";

export class ReadToken<A extends Adapter = Adapter> extends Entity<A> {
  contract: Contract<typeof erc20.abi, A>;

  constructor({ address, ...config }: ContractEntityConfig<A>) {
    super(config);
    this.contract = this.drift.contract({
      abi: erc20.abi,
      address,
    });
  }

  get address(): Address {
    return this.contract.address;
  }

  getName(): Promise<string> {
    return this.contract.read("name");
  }

  getSymbol(): Promise<string> {
    return this.contract.read("symbol");
  }

  getDecimals(): Promise<number> {
    return this.contract.read("decimals");
  }

  getAllowance({
    owner,
    spender,
    options,
  }: {
    owner: Address;
    spender: Address;
    options?: ContractReadOptions;
  }): Promise<bigint> {
    return this.contract.read("allowance", { owner, spender }, options);
  }

  getBalanceOf(
    account: Address,
    options?: ContractReadOptions,
  ): Promise<bigint> {
    return this.contract.read("balanceOf", { account }, options);
  }

  /**
   * Get the total supply of the token.
   */
  getTotalSupply(options?: ContractReadOptions): Promise<bigint> {
    return this.contract.read("totalSupply", {}, options);
  }
}
