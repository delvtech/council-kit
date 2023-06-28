import { Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { CouncilContext } from "src/context/context";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { LockingVaultContractDataSource } from "src/datasources/votingVault/LockingVaultContractDataSource";
import { Token } from "src/models/token/Token";
import { Voter } from "src/models/Voter";
import { VoterPowerBreakdown } from "src/models/votingVault/types";
import { sumStrings } from "src/utils/sumStrings";
import { VotingVault, VotingVaultOptions } from "./VotingVault";

export interface LockingVaultOptions extends VotingVaultOptions {
  dataSource?: LockingVaultContractDataSource;
}

/**
 * A VotingVault that gives voting power for depositing tokens.
 * @category Models
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
          { address, type: LockingVaultContractDataSource.type },
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
   * vault.
   */
  getDepositedBalance(address: string): Promise<string> {
    return this.dataSource.getDepositedBalance(address);
  }

  /**
   * Get all participants with voting power in this vault.
   * @param fromBlock - Include all voters that had power on or after this block number.
   * @param toBlock - Include all voters that had power on or before this block number.
   */
  async getVoters(fromBlock?: number, toBlock?: number): Promise<Voter[]> {
    const votersWithPower = await this.dataSource.getVotingPowerBreakdown(
      undefined,
      fromBlock,
      toBlock,
    );
    return votersWithPower.map(
      ({ address }) => new Voter(address, this.context),
    );
  }

  /**
   * Get all participants that have voting power in this vault along with their
   * voting power, the amount of voting power being delegated to them, and the
   * amount of power delegated to them by each delegator. This is a convenience
   * method to fetch voting power and delegation data for a large number of
   * voters in a single call.
   * @param address - Get a breakdown for a specific address.
   * @param fromBlock - Include all voters that had power on or after this block
   * number.
   * @param toBlock - Include all voters that had power on or before this block
   * number.
   */
  async getVotingPowerBreakdown(
    address?: string,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoterPowerBreakdown[]> {
    const voterPowerBreakdowns = await this.dataSource.getVotingPowerBreakdown(
      address,
      fromBlock,
      toBlock,
    );
    return voterPowerBreakdowns.map(
      ({ address, votingPower, votingPowerFromDelegators, delegators }) => ({
        voter: new Voter(address, this.context),
        votingPower,
        votingPowerFromDelegators,
        delegators: delegators.map(({ address, votingPower }) => ({
          voter: new Voter(address, this.context),
          votingPower,
        })),
      }),
    );
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
    return this.dataSource.getHistoricalVotingPower(address, atBlock);
  }

  /**
   * Get the sum of voting power held by all voters in this Vesting Vault.
   * @param atBlock - Get the total held at this block number.
   */
  async getTotalVotingPower(atBlock?: number): Promise<string> {
    const allVotersWithPower = await this.dataSource.getVotingPowerBreakdown(
      undefined,
      undefined,
      atBlock,
    );
    return sumStrings(allVotersWithPower.map(({ votingPower }) => votingPower));
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
   * Change current delegate.
   * @param signer - The Signer of the address delegating.
   * @param delegate - The address to delegate to.
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
   * Deposit tokens into this vault.
   * @param signer - The Signer of the wallet with the tokens.
   * @param account - The address to credit this deposit to.
   * @param amount - The amount of tokens to deposit. (formatted decimal string)
   * @param firstDelegate - The address to delegate the resulting voting power to
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
   * Withdraw tokens from this vault.
   * @param signer - The Signer of the wallet with a deposited balance.
   * @param amount - The amount of tokens to withdraw. (formatted decimal string)
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
