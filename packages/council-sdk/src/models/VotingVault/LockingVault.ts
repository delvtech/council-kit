import { Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { CouncilContext } from "src/context";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { LockingVaultContractDataSource } from "src/datasources/VotingVault/LockingVaultContractDataSource";
import { Token } from "src/models/Token";
import { Voter } from "src/models/Voter";
import { sumStrings } from "src/utils/sumStrings";
import { VotingVault, VotingVaultOptions } from "./VotingVault";

interface LockingVaultOptions extends VotingVaultOptions {
  dataSource?: LockingVaultContractDataSource;
}

/**
 * A VotingVault that gives voting power for depositing tokens.
 */
export class LockingVault extends VotingVault<LockingVaultContractDataSource> {
  constructor(
    address: string,
    context: CouncilContext,
    options?: LockingVaultOptions,
  ) {
    super(address, context, {
      ...options,
      name: options?.name ?? "Locking Vault",
      dataSource:
        options?.dataSource ??
        context.registerDataSource(
          { address },
          new LockingVaultContractDataSource(address, context),
        ),
    });
  }

  /**
   * Get the associated token for this LockingVault.
   */
  async getToken(): Promise<Token> {
    const address = await this.dataSource.getToken();
    return new Token(address, this.context);
  }

  /**
   * Get the amount of tokens that a given `address` has deposited into this
   * Locking Vault.
   */
  getDepositedBalance(address: string): Promise<string> {
    return this.dataSource.getDepositedBalance(address);
  }

  /**
   * Get all participants with voting power in this vault.
   * @param fromBlock The block number to start searching for voters from.
   * @param toBlock The block number to stop searching for voters at.
   */
  async getVoters(fromBlock?: number, toBlock?: number): Promise<Voter[]> {
    const votersWithPower = await this.dataSource.getAllVotersWithPower(
      fromBlock,
      toBlock,
    );
    return votersWithPower.map(
      ({ address }) => new Voter(address, this.context),
    );
  }

  /**
   * Get the sum of voting power held by all voters in this Vesting Vault.
   * @param fromBlock The block number to start searching for voters from.
   * @param toBlock The block number to stop searching for voters at.
   */
  async getTotalVotingPower(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<string> {
    const allVotersWithPower = await this.dataSource.getAllVotersWithPower(
      fromBlock,
      toBlock,
    );
    return sumStrings(allVotersWithPower.map(({ power }) => power));
  }

  /**
   * Get the number of blocks before the delegation history is forgotten. Voting
   * power from this vault can't be used on proposals that are older than the
   * stale block lag.
   */
  getStaleBlockLag(): Promise<number> {
    return this.dataSource.getStaleBlockLag();
  }

  /**
   * Get the voting power for a given address at a given block without
   * accounting for the stale block lag.
   */
  async getHistoricalVotingPower(
    address: string,
    atBlock?: number,
  ): Promise<string> {
    return this.dataSource.getHistoricalVotingPower(
      address,
      atBlock ?? (await this.context.provider.getBlockNumber()),
    );
  }

  /**
   * Get the current delegate of a given address.
   */
  async getDelegate(address: string): Promise<Voter> {
    const delegateAddress = await this.dataSource.getDelegate(address);
    return new Voter(delegateAddress, this.context);
  }

  /**
   * Get all voters delegated to a given address in this vault.
   */
  async getDelegatorsTo(address: string, atBlock?: number): Promise<Voter[]> {
    const delegators = await this.dataSource.getDelegatorsTo(address, atBlock);
    return delegators.map(({ address }) => new Voter(address, this.context));
  }

  /**
   * Change current delegate
   * @param signer The Signer of the address delegating
   * @param delegate The address to delegate to.
   * @returns The transaction hash.
   */
  changeDelegate(
    signer: Signer,
    delegate: string,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.changeDelegate(signer, delegate, options);
  }

  /**
   * Deposit tokens into this Locking Vault.
   * @param signer The Signer of the wallet with the tokens.
   * @param account The address to credit this deposit to.
   * @param amount The amount of tokens to deposit. (formatted decimal string)
   * @param firstDelegate The address to delegate the resulting voting power to
   *   if the account doesn't already have a delegate.
   * @returns The transaction hash.
   */
  async deposit(
    signer: Signer,
    account: string,
    amount: string,
    firstDelegate?: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const token = await this.getToken();
    const decimals = await token.getDecimals();
    return this.dataSource.deposit(
      signer,
      account,
      parseUnits(amount, decimals),
      firstDelegate ?? account,
      options,
    );
  }

  /**
   * Withdraw tokens from this Locking Vault.
   * @param signer The Signer of the wallet with a deposited balance.
   * @param amount The amount of tokens to withdraw. (formatted decimal string)
   * @returns The transaction hash.
   */
  async withdraw(
    signer: Signer,
    amount: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const token = await this.getToken();
    const decimals = await token.getDecimals();
    return this.dataSource.withdraw(
      signer,
      parseUnits(amount, decimals),
      options,
    );
  }
}
