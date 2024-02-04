import {
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@council/evm-client";
import { CachedReadWriteContractFactory } from "src/contract/factory";
import { ReadWriteContractModelOptions } from "src/models/Model";
import { ReadWriteToken } from "src/models/token/ReadWriteToken";
import { ReadLockingVault } from "src/models/votingVault/lockingVault/ReadLockingVault";
import { LockingVaultAbi } from "src/models/votingVault/lockingVault/types";

export interface ReadWriteLockingVaultOptions
  extends ReadWriteContractModelOptions {}

export class ReadWriteLockingVault extends ReadLockingVault {
  declare lockingVaultContract: CachedReadWriteContract<LockingVaultAbi>;
  declare contractFactory: CachedReadWriteContractFactory;

  constructor(options: ReadWriteLockingVaultOptions) {
    super(options);
  }

  override async getToken(): Promise<ReadWriteToken> {
    return new ReadWriteToken({
      address: await this.lockingVaultContract.read("token"),
      contractFactory: this.contractFactory,
      network: this.network,
    });
  }

  /**
   * Change current delegate.
   * @param delegate - The address to delegate to.
   * @returns The transaction hash.
   */
  async changeDelegate({
    delegate,
    options,
  }: {
    delegate: `0x${string}`;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.lockingVaultContract.write(
      "changeDelegation",
      delegate,
      options,
    );
    this.contract.clearCache();
    return hash;
  }

  /**
   * Deposit tokens into this vault.
   * @param account - The address to credit this deposit to.
   * @param amount - The amount of tokens to deposit. (formatted decimal string)
   * @param firstDelegate - The address to delegate the resulting voting power to
   *   if the account doesn't already have a delegate.
   * @returns The transaction hash.
   */
  async deposit({
    account,
    amount,
    firstDelegate,
    options,
  }: {
    account: `0x${string}`;
    amount: bigint;
    firstDelegate?: `0x${string}`;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.lockingVaultContract.write(
      "deposit",
      {
        amount,
        fundedAccount: account,
        firstDelegation: firstDelegate ?? account,
      },
      options,
    );
    this.contract.clearCache();
    const token = await this.getToken();
    token.contract.clearCache();
    return hash;
  }

  /**
   * Withdraw tokens from this vault.
   * @param amount - The amount of tokens to withdraw. (formatted decimal string)
   * @returns The transaction hash.
   */
  async withdraw({
    amount,
    options,
  }: {
    amount: bigint;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.lockingVaultContract.write(
      "withdraw",
      amount,
      options,
    );
    this.contract.clearCache();
    const token = await this.getToken();
    token.contract.clearCache();
    return hash;
  }
}
