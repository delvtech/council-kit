import { Adapter, Contract, ContractReadOptions } from "@delvtech/drift";
import { Address } from "abitype";
import { SdkClient, SdkContractConfig } from "src/drift/SdkClient";
import { erc20Abi, Erc20Abi } from "src/token/erc20/abi";
import { ReadToken } from "src/token/ReadToken";

export class ReadErc20<A extends Adapter = Adapter>
  extends SdkClient<A>
  implements ReadToken<A>
{
  contract: Contract<Erc20Abi, A>;

  constructor({
    debugName = "ERC-20 Token",
    address,
    ...rest
  }: SdkContractConfig<A>) {
    super({ debugName, ...rest });
    this.contract = this.drift.contract({
      abi: erc20Abi,
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
    owner: `0x${string}`;
    spender: `0x${string}`;
    options?: ContractReadOptions;
  }): Promise<bigint> {
    return this.contract.read("allowance", { owner, spender }, options);
  }

  getBalanceOf({
    account,
    options,
  }: {
    account: `0x${string}`;
    options?: ContractReadOptions;
  }): Promise<bigint> {
    return this.contract.read("balanceOf", { account }, options);
  }

  /**
   * Get the total supply of the token.
   */
  getTotalSupply(options?: ContractReadOptions): Promise<bigint> {
    return this.contract.read("totalSupply", {}, options);
  }
}
