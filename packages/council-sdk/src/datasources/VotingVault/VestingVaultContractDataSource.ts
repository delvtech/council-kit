import { VestingVault, VestingVault__factory } from "@council/typechain";
import { BigNumber, Signer } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context/context";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";
import { VotingVaultDataSource } from "./VotingVaultDataSource";

/**
 * A DataSource with methods for making cached calls to a `VestingVault`
 * contract from the Council protocol.
 * @category Data Sources
 */

export class VestingVaultContractDataSource
  extends VotingVaultContractDataSource<VestingVault>
  implements VotingVaultDataSource
{
  constructor(address: string, context: CouncilContext) {
    super(VestingVault__factory.connect(address, context.provider), context);
  }

  /**
   * Get the address of the associated token for this vault.
   */
  getToken(): Promise<string> {
    return this.call("token", []);
  }

  /**
   * Get this vault's unvested multiplier, a number that represents the voting
   * power of each unvested token as a percentage of a vested token. For example
   * if unvested tokens have 50% voting power compared to vested ones, this
   * value would be 50.
   */
  async getUnvestedMultiplier(): Promise<number> {
    const unvestedMultiplierBN = await this.call("unvestedMultiplier", []);
    return unvestedMultiplierBN.toNumber();
  }

  /**
   * Get the grant data for a given address.
   */
  async getGrant(address: string): Promise<GrantData> {
    const {
      allocation,
      withdrawn,
      created,
      expiration,
      cliff,
      latestVotingPower,
      delegatee,
      range,
    } = await this.call("getGrant", [address]);
    return {
      allocation: formatEther(allocation),
      withdrawn: formatEther(withdrawn),
      startBlock: created.toNumber(),
      expirationBlock: expiration.toNumber(),
      unlockBlock: cliff.toNumber(),
      votingPower: formatEther(latestVotingPower),
      delegate: delegatee.toString(),
      range: [formatEther(range[0]), formatEther(range[1])],
    };
  }

  /**
   * Get the address of the current delegate of a given address.
   */
  async getDelegate(address: string): Promise<string> {
    const grant = await this.getGrant(address);
    return grant.delegate;
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
            byDelegator: Record<
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
              byDelegator: {},
            };
          }

          breakdownsByVoter[to].power = breakdownsByVoter[to].power.add(amount);

          // ignore self-delegation
          if (from !== to) {
            breakdownsByVoter[to].fromDelegators =
              breakdownsByVoter[to].fromDelegators.add(amount);
            breakdownsByVoter[to].byDelegator[from] =
              breakdownsByVoter[to].byDelegator[from]?.add(amount) || amount;
          }
        }

        return Object.entries(breakdownsByVoter)
          .filter(([, { power }]) => power.gt(0))
          .map(([address, { power, fromDelegators, byDelegator }]) => ({
            address,
            votingPower: formatEther(power),
            votingPowerFromDelegators: formatEther(fromDelegators),
            delegators: Object.entries(byDelegator)
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
      "delegate",
      [delegate],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }

  /**
   * Claim a grant and withdraw the tokens.
   * @param signer - The Signer of the wallet with a grant to claim.
   * @returns The transaction hash.
   */
  async claim(signer: Signer, options?: TransactionOptions): Promise<string> {
    const transaction = await this.callWithSigner("claim", [], signer, options);
    this.clearCached();
    return transaction.hash;
  }
}

/**
 * A grant as it's stored in the contract.
 * @category Data Sources
 */
export interface GrantData {
  /**
   * The total amount of tokens granted.
   */
  allocation: string;

  /**
   * The amount of tokens that have been withdrawn.
   */
  withdrawn: string;

  /**
   * The block number of when the grant starts.
   */
  startBlock: number;

  /**
   * The block number of when the full allocation is vested and any
   * remaining balance can be withdrawn.
   */
  expirationBlock: number;

  /**
   * The block number after which any withdrawable tokens can be withdrawn.
   */
  unlockBlock: number;

  /**
   * The voting power provided by the grant.
   */
  votingPower: string;

  /**
   * The address that can vote with this grant's voting power.
   */
  delegate: string;

  /**
   * The specific range of enumerated tokens in the vault that belong to this
   * grant. This is set when a grant is accepted with the `acceptGrant` method.
   */
  range: [string, string];
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
