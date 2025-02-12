import { LockingVault } from "@delvtech/council-artifacts/LockingVault";
import {
  Adapter,
  Address,
  Bytes,
  Contract,
  ContractReadOptions,
} from "@delvtech/drift";
import { ContractEntityConfig } from "src/entities/Entity";
import { ReadToken } from "src/entities/token/ReadToken";
import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";
import {
  VoterPowerBreakdown,
  VoterWithPower,
} from "src/entities/votingVault/types";
import { getBlockOrThrow } from "src/utils/getBlockOrThrow";
import { Blockish } from "src/utils/types";

/**
 * A VotingVault that gives voting power for depositing tokens.
 */
export class ReadLockingVault<
  A extends Adapter = Adapter,
> extends ReadVotingVault<A> {
  readonly lockingVaultContract: Contract<typeof LockingVault.abi, A>;

  constructor(config: ContractEntityConfig<A>) {
    super(config);
    this.lockingVaultContract = this.drift.contract({
      abi: LockingVault.abi,
      address: this.address,
    });
  }

  /**
   * Get the number of blocks before the delegation history is forgotten. Voting
   * power from this vault can't be used on proposals that are older than the
   * stale block lag.
   */
  getStaleBlockLag(): Promise<bigint> {
    return this.lockingVaultContract.read("staleBlockLag");
  }

  /**
   * Get the associated token for this LockingVault.
   */
  async getToken(): Promise<ReadToken> {
    return new ReadToken({
      address: await this.lockingVaultContract.read("token"),
      drift: this.drift,
    });
  }

  /**
   * Get the deposit balance of a given account.
   */
  async getBalanceOf(
    account: Address,
    options?: ContractReadOptions,
  ): Promise<bigint> {
    const deposits = await this.lockingVaultContract.read(
      "deposits",
      { who: account },
      options,
    );
    return deposits[1];
  }

  /**
   * Get the current delegate of a given account.
   */
  async getDelegate(
    account: Address,
    options?: ContractReadOptions,
  ): Promise<Address> {
    const { 0: delegate } = await this.lockingVaultContract.read(
      "deposits",
      { who: account },
      options,
    );
    return delegate;
  }

  /**
   * Get all voters delegated to a given account in this vault.
   */
  async getDelegatorsTo(
    voter: Address,
    {
      fromBlock,
      toBlock,
    }: {
      fromBlock?: Blockish;
      toBlock?: Blockish;
    },
  ): Promise<VoterWithPower[]> {
    const breakdown = await this.getVotingPowerBreakdown({
      voter,
      fromBlock,
      toBlock,
    });
    return breakdown[0].delegators;
  }

  /**
   * Get the voting power for a given address at a given block without
   * accounting for the stale block lag.
   */
  async getHistoricalVotingPower({
    voter,
    /**
     * The block to get voting power at. Usually the creation block of a
     * proposal.
     */
    block,
    options,
  }: {
    voter: Address;
    block: Blockish;
    extraData?: Bytes;
    options?: ContractReadOptions;
  }): Promise<bigint> {
    if (typeof block !== "bigint") {
      const { number } = await getBlockOrThrow(this.drift, options);

      // No block number available for the requested hash or tag.
      if (number === undefined) {
        return 0n;
      }

      block = number;
    }

    return this.lockingVaultContract.read("queryVotePowerView", {
      user: voter,
      blockNumber: block,
    });
  }

  /**
   * Get the sum of voting power held by all voters in this vault.
   */
  async getTotalVotingPower({
    fromBlock,
    toBlock,
  }: {
    fromBlock?: Blockish;
    toBlock?: Blockish;
  } = {}): Promise<bigint> {
    const breakdown = await this.getVotingPowerBreakdown({
      fromBlock,
      toBlock,
    });
    return Object.values(breakdown).reduce(
      (sum, { votingPower }) => sum + votingPower,
      0n,
    );
  }

  /**
   * Get all participants that have voting power in this vault along with their
   * voting power, the amount of voting power being delegated to them, and the
   * amount of power delegated to them by each delegator. This is a convenience
   * method to fetch voting power and delegation data for a large number of
   * voters in a single call.
   */
  async getVotingPowerBreakdown({
    voter,
    fromBlock,
    toBlock,
  }: {
    /**
     * Get a breakdown for a specific account.
     */
    voter?: Address;
    fromBlock?: Blockish;
    toBlock?: Blockish;
  } = {}): Promise<VoterPowerBreakdown[]> {
    const voteChangeEvents = await this.lockingVaultContract.getEvents(
      "VoteChange",
      {
        filter: { to: voter },
        fromBlock,
        toBlock,
      },
    );

    const breakdownByVoter: {
      [voter: Address]: {
        votingPower: bigint;
        votingPowerFromDelegators: bigint;
        powerByDelegator: {
          [delegator: Address]: bigint;
        };
      };
    } = {};

    // Calculate the delegated voting power for each voter.
    for (const {
      args: { from, to, amount },
    } of voteChangeEvents) {
      const breakdown = (breakdownByVoter[to] ||= {
        votingPower: 0n,
        votingPowerFromDelegators: 0n,
        powerByDelegator: {},
      });

      breakdown.votingPower += amount;

      // ignore self-delegation
      if (from !== to) {
        breakdown.votingPowerFromDelegators += amount;
        breakdown.powerByDelegator[from] ??= 0n;
        breakdown.powerByDelegator[from] += amount;
      }
    }

    let breakdowns: VoterPowerBreakdown[] = [];

    // Convert objects to arrays and filter out voters with no voting power.
    for (const [voter, breakdown] of Object.entries(breakdownByVoter)) {
      const { votingPower, votingPowerFromDelegators, powerByDelegator } =
        breakdown;
      if (votingPower <= 0n) continue;

      let delegators: VoterWithPower[] = [];

      for (const [delegator, votingPower] of Object.entries(powerByDelegator)) {
        if (votingPower <= 0n) continue;
        delegators.push({
          voter: delegator as Address,
          votingPower,
        });
      }

      breakdowns.push({
        voter: voter as Address,
        votingPower,
        votingPowerFromDelegators,
        delegators,
      });
    }

    return breakdowns;
  }
}
