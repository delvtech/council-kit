import { LockingVault, LockingVault__factory } from "@council/typechain";
import { VoteChangeEvent } from "@council/typechain/dist/contracts/vaults/LockingVault.sol/LockingVault";
import { BigNumber, Signer } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context";
import { TransactionOptions } from "src/datasources/CachedDataSource/ContractDataSource/ContractDataSource";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";
import { TokenDataSource } from "src/datasources/TokenDataSource";
import { CachedDataSource } from "src/datasources/CachedDataSource/CachedDataSource";

/**
 * A DataSource with methods for making cached calls to a `LockingVault`
 * contract from the Council protocol.
 * @category Data Sources
 */
export class LockingVaultContractDataSource extends VotingVaultContractDataSource<LockingVault> {
  constructor(address: string, context: CouncilContext) {
    super(LockingVault__factory.connect(address, context.provider), context);
    this.context = context;
  }

  /**
   * Get the address of the associated token for this vault.
   */
  getToken(): Promise<string> {
    return this.call("token", []);
  }

  /**
   * Get the amount of tokens that a given `address` has deposited into this
   * vault.
   */
  async getDepositedBalance(address: string): Promise<string> {
    const [, balanceBigNumber] = await this.call("deposits", [address]);
    return formatEther(balanceBigNumber);
  }

  /**
   * Get the address of the current delegate of a given address.
   */
  async getDelegate(address: string): Promise<string> {
    const [delegate] = await this.call("deposits", [address]);
    return delegate;
  }

  /**
   * Get the addresses of all voters delegated to a given address in this vault.
   */
  getDelegatorsTo(
    address: string,
    atBlock?: number,
  ): Promise<VoterWithPower[]> {
    return this.cached(["getDelegatorsTo", address, atBlock], async () => {
      const voteChangeEvents = await this.getVoteChangeEvents(
        undefined,
        address,
        undefined,
        atBlock,
      );
      const powerByDelegators: Record<string, BigNumber> = {};
      for (const { args } of voteChangeEvents) {
        const { from, amount } = args;
        powerByDelegators[from] =
          powerByDelegators[from]?.add(amount) || amount;
      }
      return Object.entries(powerByDelegators)
        .filter(([, power]) => power.gt(0))
        .map(([address, power]) => ({
          address,
          power: formatEther(power),
        }));
    });
  }

  /**
   * Get the number of blocks before the delegation history is forgotten. Voting
   * power from this vault can't be used on proposals that are older than the
   * stale block lag.
   */
  async getStaleBlockLag(): Promise<number> {
    const staleBlockLagBigNumber = await this.call("staleBlockLag", []);
    return staleBlockLagBigNumber.toNumber();
  }

  /**
   * Get the voting power for a given address at a given block without
   * accounting for the stale block lag.
   */
  async getHistoricalVotingPower(
    address: string,
    atBlock: number,
  ): Promise<string> {
    const votingPowerBigNumber = await this.call("queryVotePowerView", [
      address,
      atBlock,
    ]);
    return formatEther(votingPowerBigNumber);
  }

  /**
   * Get the address and voting power of all participants that have voting power
   * in this vault.
   * @param fromBlock - The block number to start searching for voters from.
   * @param toBlock - The block number to stop searching for voters at.
   */
  async getAllVotersWithPower(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoterWithPower[]> {
    return this.cached(
      ["getAllVotersWithPower", fromBlock, toBlock],
      async () => {
        const voteChangeEvents = await this.getVoteChangeEvents(
          undefined,
          undefined,
          fromBlock,
          toBlock,
        );
        const powersByVoter: Record<string, BigNumber> = {};
        for (const { args } of voteChangeEvents) {
          const { to, amount } = args;
          powersByVoter[to] = powersByVoter[to]?.add(amount) || amount;
        }
        return Object.entries(powersByVoter)
          .filter(([, power]) => power.gt(0))
          .map(([address, power]) => ({
            address,
            power: formatEther(power),
          }));
      },
    );
  }

  /**
   * Get all emitted `VoteChange` events.
   * @param from - The address that the voting power is coming from.
   * @param to - The address that the voting power is going to.
   * @param fromBlock - The block to start searching for events from.
   * @param toBlock - The block to stop searching for events at.
   */
  getVoteChangeEvents(
    from?: string,
    to?: string,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoteChangeEvent[]> {
    return this.cached(["VoteChange", from, to, fromBlock, toBlock], () => {
      const filter = this.contract.filters.VoteChange(from, to);
      return this.contract.queryFilter(filter, fromBlock, toBlock);
    });
  }

  /**
   * Change current delegate.
   * @param signer - The Signer of the address delegating.
   * @param delegate - The address to delegate to.
   * @returns The transaction hash.
   */
  async changeDelegate(
    signer: Signer,
    delegate: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "changeDelegation",
      [delegate],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }

  /**
   * Deposit tokens into this vault.
   * @param signer - The Signer of the wallet with the tokens.
   * @param account - The address to credit this deposit to.
   * @param amount - A BigNumber of the amount of tokens to deposit.
   * @param firstDelegate - The address to delegate the resulting voting power to
   *   if the account doesn't already have a delegate.
   * @returns The transaction hash.
   */
  async deposit(
    signer: Signer,
    account: string,
    amount: BigNumber,
    firstDelegate: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "deposit",
      [account, amount, firstDelegate],
      signer,
      options,
    );
    this.clearTokenCached();
    this.clearCached();
    return transaction.hash;
  }

  /**
   * Withdraw tokens from this Locking Vault.
   * @param signer - The Signer of the wallet with a deposited balance.
   * @param amount - A BigNumber of the amount of tokens to withdraw.
   * @returns The transaction hash.
   */
  async withdraw(
    signer: Signer,
    amount: BigNumber,
    options?: TransactionOptions,
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "withdraw",
      [amount],
      signer,
      options,
    );
    this.clearTokenCached();
    this.clearCached();
    return transaction.hash;
  }

  /**
   * Checks the `context` for a `TokenDataSource` for this vault's
   * token and clears the cache if it's a `CachedDataSource`.
   */
  private async clearTokenCached() {
    const tokenDataSource = this.context.getDataSource<TokenDataSource>({
      address: await this.getToken(),
    });
    if (tokenDataSource instanceof CachedDataSource) {
      tokenDataSource.clearCached();
    }
  }
}

/**
 * @category Data Sources
 */
export interface VoterWithPower {
  address: string;
  power: string;
}
