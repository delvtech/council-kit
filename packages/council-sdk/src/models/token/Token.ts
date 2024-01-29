import { MockERC20 } from "@council/artifacts/dist/MockERC20";
import {
  CachedReadContract,
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@council/evm-client";
import { BlockLike, blockToReadOptions } from "src/contract/args";
import { CachedReadWriteContractFactory } from "src/contract/factory";
import {
  Model,
  ReadContractModelOptions,
  ReadWriteContractModelOptions,
} from "src/models/Model";

// Using MockERC20 abi for convenience to make extending to the MockToken model
// more straightforward without having to keep track of two different abis.
const erc20Abi = MockERC20.abi;
type ERC20Abi = typeof erc20Abi;

/**
 * @category Models
 */
export interface ReadTokenOptions extends ReadContractModelOptions {}

/**
 * @category Models
 */
export class ReadToken extends Model {
  protected _contract: CachedReadContract<ERC20Abi>;

  constructor({
    address,
    contractFactory,
    network,
    cache,
    id,
    name,
  }: ReadTokenOptions) {
    super({ name, network, contractFactory });
    this._contract = contractFactory({
      abi: erc20Abi,
      address,
      cache,
      id,
    });
  }

  get address(): `0x${string}` {
    return this._contract.address;
  }

  /**
   * Get the symbol for this token.
   */
  getSymbol(): Promise<string> {
    return this._contract.read("symbol", {});
  }

  /**
   * Get the number of decimal places this token uses.
   */
  getDecimals(): Promise<number> {
    return this._contract.read("decimals", {});
  }

  /**
   * Get the name of this token
   */
  getName(): Promise<string> {
    return this._contract.read("name", {});
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
    return this._contract.read(
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
    address,
    atBlock,
  }: {
    address: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    return this._contract.read(
      "balanceOf",
      address,
      blockToReadOptions(atBlock),
    );
  }
}

/**
 * @category Models
 */
export interface ReadWriteTokenOptions extends ReadWriteContractModelOptions {}

/**
 * @category Models
 */
export class ReadWriteToken extends ReadToken {
  protected declare _contract: CachedReadWriteContract<ERC20Abi>;
  protected declare _contractFactory: CachedReadWriteContractFactory;

  constructor(options: ReadWriteTokenOptions) {
    super(options);
  }

  /**
   * Give a spending allowance to a given spender.
   * @param owner - The address of the owner.
   * @param spender - The address of the spender.
   * @param amount - The amount of tokens the spender can spend.
   * @returns The transaction hash.
   */
  async approve({
    owner,
    spender,
    amount,
    options,
  }: {
    owner: `0x${string}`;
    spender: `0x${string}`;
    amount: bigint;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this._contract.write(
      "approve",
      {
        account: spender,
        amount,
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
