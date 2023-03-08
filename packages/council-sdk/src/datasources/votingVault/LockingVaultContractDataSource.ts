import { LockingVault, LockingVault__factory } from "@council/typechain";
import { BigNumber, Signer } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context/context";
import { CachedDataSource } from "src/datasources/base/cached/CachedDataSource";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { TokenDataSource } from "src/datasources/token/TokenDataSource";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";

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
  ): Promise<VoterAddressWithPower[]> {
    return this.cached(["getDelegatorsTo", address, atBlock], async () => {
      const eventFilter = this.contract.filters.VoteChange(undefined, address);
      const voteChangeEvents = await this.getEvents(
        eventFilter,
        undefined,
        atBlock,
      );
      const powerByDelegators: Record<string, BigNumber> = {};
      for (const { args } of voteChangeEvents) {
        const { from, amount } = args;
        // ignore self-delegation
        if (from !== address) {
          powerByDelegators[from] =
            powerByDelegators[from]?.add(amount) || amount;
        }
      }
      return Object.entries(powerByDelegators)
        .filter(([, power]) => power.gt(0))
        .map(([address, power]) => ({
          address,
          votingPower: formatEther(power),
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
    atBlock?: number,
  ): Promise<string> {
    // Using this.cached instead of this.call because the atBlock argument is
    // required by the queryVotePowerView method, but we want the atBlock
    // argument optional. So instead we make the cache key include the possibly
    // undefined argument, then grab the latest block in the callback if it's
    // not defined. This means that subsequent calls to getHistoricalVotingPower
    // will return a cached value unless explicitly called with a specific
    // atBlock.
    const votingPowerBigNumber = await this.cached(
      ["queryVotePowerView", address, atBlock],
      async () => {
        return await this.contract.queryVotePowerView(
          address,
          atBlock ?? (await this.context.provider.getBlockNumber()),
        );
      },
    );
    return formatEther(votingPowerBigNumber);
  }

  /**
   * Get the address of all participants that have voting power in this vault
   * along with their voting power, the amount of voting power being delegated
   * to them, and the amount of power delegated to them by each delegator. This
   * is a convenience method to fetch voting power and delegation data for a
   * large number of voters in a single call.
   * @param fromBlock - Include all voters that had power on or after this block
   * number.
   * @param toBlock - Include all voters that had power on or before this block
   * number.
   */
  async getVotingPowerBreakdown(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoterAddressPowerBreakdown[]> {
    return this.cached(
      ["getVotingPowerBreakdown", fromBlock, toBlock],
      async () => {
        const eventFilter = this.contract.filters.VoteChange(
          undefined,
          undefined,
        );
        const voteChangeEvents = await this.getEvents(
          eventFilter,
          fromBlock,
          toBlock,
        );

        const breakdownsByVoter: Record<
          string, // voter address
          {
            power: BigNumber;
            fromDelegators: BigNumber;
            byDelegators: Record<
              string, // delegator address
              BigNumber
            >;
          }
        > = {};

        for (const { args } of voteChangeEvents) {
          const { from, to, amount } = args;

          if (!breakdownsByVoter[to]) {
            breakdownsByVoter[to] = {
              power: BigNumber.from(0),
              fromDelegators: BigNumber.from(0),
              byDelegators: {},
            };
          }

          breakdownsByVoter[to].power = breakdownsByVoter[to].power.add(amount);

          // ignore self-delegation
          if (from !== to) {
            breakdownsByVoter[to].fromDelegators =
              breakdownsByVoter[to].fromDelegators.add(amount);
            breakdownsByVoter[to].byDelegators[from] =
              breakdownsByVoter[to].byDelegators[from]?.add(amount) || amount;
          }
        }

        return Object.entries(breakdownsByVoter)
          .filter(([, { power }]) => power.gt(0))
          .map(([address, { power, fromDelegators, byDelegators }]) => ({
            address,
            votingPower: formatEther(power),
            votingPowerFromDelegators: formatEther(fromDelegators),
            delegators: Object.entries(byDelegators)
              .filter(([, power]) => power.gt(0))
              .map(([address, power]) => ({
                address,
                votingPower: formatEther(power),
              })),
          }));
      },
    );
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
export interface VoterAddressWithPower {
  address: string;
  votingPower: string;
}

/**
 * @category Data Sources
 */
export interface VoterAddressPowerBreakdown extends VoterAddressWithPower {
  /**
   * The total voting power from all wallets delegated to this voter. Does not
   * include self-delegation.
   */
  votingPowerFromDelegators: string;
  /**
   * All wallets delegated to this voter with the power they're delegating. Does
   * not include self-delegation.
   */
  delegators: VoterAddressWithPower[];
}
