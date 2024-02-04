import {
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@council/evm-client";
import { CachedReadWriteContractFactory } from "src/contract/factory";
import { ReadWriteContractModelOptions } from "src/models/Model";
import { ReadToken } from "src/models/token/ReadToken";
import { ERC20Abi } from "src/models/token/types";

/**
 * @category Models
 */
export interface ReadWriteTokenOptions extends ReadWriteContractModelOptions {}

/**
 * @category Models
 */
export class ReadWriteToken extends ReadToken {
  declare contract: CachedReadWriteContract<ERC20Abi>;
  declare contractFactory: CachedReadWriteContractFactory;

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
    const hash = await this.contract.write(
      "approve",
      {
        account: spender,
        amount,
      },
      options,
    );
    this.contract.deleteRead("allowance", {
      0: owner,
      1: spender,
    });
    return hash;
  }
}
