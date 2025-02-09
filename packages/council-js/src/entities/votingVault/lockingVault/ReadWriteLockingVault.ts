import {
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@delvtech/evm-client";
import { ReadWriteContractFactory } from "src/contract/factory";
import { ReadWriteContractModelOptions } from "src/entities/Model";
import { ReadWriteToken } from "src/entities/token/ReadWriteToken";
import { ReadLockingVault } from "src/entities/votingVault/lockingVault/ReadLockingVault";
import { LockingVaultAbi } from "src/entities/votingVault/lockingVault/types";

export interface ReadWriteLockingVaultOptions
  extends ReadWriteContractModelOptions {}

export class ReadWriteLockingVault extends ReadLockingVault {
  declare lockingVaultContract: CachedReadWriteContract<LockingVaultAbi>;
  declare contractFactory: ReadWriteContractFactory;

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
      { newDelegate: delegate },
      options,
    );
    this.contract.clearCache();
    return hash;
  }

  /**
   * Deposit tokens into this vault.
   * @param account - The address to credit this deposit to. Defaults to the
   *  signer's address.
   * @param amount - The amount of tokens to deposit. (formatted decimal string)
   * @param firstDelegate - The address to delegate the resulting voting power
   *   to if the account doesn't already have a delegate. Defaults to funded
   *   account being credited.
   * @returns The transaction hash.
   */
  async deposit({
    account,
    amount,
    firstDelegate,
    options,
  }: {
    account?: `0x${string}`;
    amount: bigint;
    firstDelegate?: `0x${string}`;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const fundedAccount =
      account ?? (await this.lockingVaultContract.getSignerAddress());
    const hash = await this.lockingVaultContract.write(
      "deposit",
      {
        amount,
        fundedAccount,
        firstDelegation: firstDelegate ?? fundedAccount,
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
      { amount },
      options,
    );
    this.contract.clearCache();
    const token = await this.getToken();
    token.contract.clearCache();
    return hash;
  }
}
