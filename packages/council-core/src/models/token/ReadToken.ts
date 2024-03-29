import { MockERC20 } from "@delvtech/council-artifacts/MockERC20";
import { CachedReadContract } from "@delvtech/evm-client";
import { Model, ReadContractModelOptions } from "src/models/Model";
import { ERC20Abi } from "src/models/token/types";
import { BlockLike, blockToReadOptions } from "src/utils/blockToReadOptions";

/**
 * @category Models
 */
export interface ReadTokenOptions extends ReadContractModelOptions {}

/**
 * @category Models
 */
export class ReadToken extends Model {
  contract: CachedReadContract<ERC20Abi>;

  constructor({
    name = "Token",
    address,
    contractFactory,
    network,
    cache,
    namespace,
  }: ReadTokenOptions) {
    super({ name, network, contractFactory });
    this.contract = contractFactory({
      abi: MockERC20.abi,
      address,
      cache,
      namespace,
    });
  }

  get address(): `0x${string}` {
    return this.contract.address;
  }
  get namespace(): string | undefined {
    return this.contract.namespace;
  }

  /**
   * Get the symbol for this token.
   */
  getSymbol(): Promise<string> {
    return this.contract.read("symbol");
  }

  /**
   * Get the number of decimal places this token uses.
   */
  getDecimals(): Promise<number> {
    return this.contract.read("decimals");
  }

  /**
   * Get the name of this token
   */
  getName(): Promise<string> {
    return this.contract.read("name");
  }

  /**
   * Get the spending allowance of a given spender for a given owner of this
   * token.
   */
  getAllowance({
    owner,
    spender,
    atBlock,
  }: {
    owner: `0x${string}`;
    spender: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    return this.contract.read(
      "allowance",
      {
        0: owner,
        1: spender,
      },
      blockToReadOptions(atBlock),
    );
  }

  /**
   * Get the token balance of a given address
   */
  getBalanceOf({
    account,
    atBlock,
  }: {
    account: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    return this.contract.read(
      "balanceOf",
      { 0: account },
      blockToReadOptions(atBlock),
    );
  }
}
