import {
  Address,
  ContractWriteOptions,
  Hash,
  ReadWriteAdapter,
} from "@delvtech/drift";
import { EntityWriteParams } from "src/entities/Entity";
import { ReadWriteToken } from "src/entities/token/ReadWriteToken";
import { ReadLockingVault } from "src/entities/votingVault/lockingVault/ReadLockingVault";

export class ReadWriteLockingVault<
  A extends ReadWriteAdapter = ReadWriteAdapter,
> extends ReadLockingVault<A> {
  async getToken(): Promise<ReadWriteToken> {
    return new ReadWriteToken({
      address: await this.lockingVaultContract.read("token"),
      drift: this.drift,
    });
  }

  /**
   * Change current delegate.
   * @returns The transaction hash.
   */
  changeDelegate({
    args,
    options,
  }: EntityWriteParams<{
    /**
     * The address to delegate to.
     */
    newDelegate: Address;
  }>): Promise<Hash> {
    return this.lockingVaultContract.write("changeDelegation", args, {
      ...options,
      onMined: async (receipt) => {
        if (receipt?.status === "success") {
          this.contract.cache.clear();
        }
        options?.onMined?.(receipt);
      },
    });
  }

  /**
   * Deposit tokens into this vault.
   * @returns The transaction hash.
   */
  async deposit({
    args: { account, amount, firstDelegate },
    options,
  }: EntityWriteParams<{
    /**
     * The amount of tokens to deposit. (formatted decimal string)
     */
    amount: bigint;
    /**
     * The address to credit this deposit to. Defaults to the signer's address.
     */
    account?: Address;
    /**
     * The address to delegate the resulting voting power to if the account
     * doesn't already have a delegate. Defaults to funded account being
     * credited.
     */
    firstDelegate?: Address;
    options?: ContractWriteOptions;
  }>): Promise<Hash> {
    const fundedAccount =
      account ?? (await this.lockingVaultContract.getSignerAddress());
    return this.lockingVaultContract.write(
      "deposit",
      {
        amount,
        fundedAccount,
        firstDelegation: firstDelegate ?? fundedAccount,
      },
      {
        ...options,
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            this.contract.cache.clear();
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }

  /**
   * Withdraw tokens from this vault.
   * @returns The transaction hash.
   */
  withdraw({
    args,
    options,
  }: EntityWriteParams<{
    /**
     * The amount of tokens to withdraw.
     */
    amount: bigint;
  }>): Promise<Hash> {
return this.lockingVaultContract.write(
      "withdraw",
      args,
      {
        ...options,
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            this.contract.cache.clear();
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }
}
