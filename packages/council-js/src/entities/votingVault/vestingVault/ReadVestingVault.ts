import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import {
  Adapter,
  Address,
  Bytes,
  Contract,
  ContractReadOptions,
} from "@delvtech/drift";
import { fixed } from "@delvtech/fixed-point-wasm";
import { ContractEntityConfig } from "src/entities/Entity";
import { ReadToken } from "src/entities/token/ReadToken";
import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";
import {
  VoterPowerBreakdown,
  VoterWithPower,
} from "src/entities/votingVault/types";
import { Grant } from "src/entities/votingVault/vestingVault/types";
import { getBlockOrThrow } from "src/utils/getBlockOrThrow";
import { Blockish } from "src/utils/types";

/**
 * A VotingVault that gives voting power for receiving grants and applies a
 * multiplier on unvested tokens to reduce their voting power.
 */
export class ReadVestingVault<
  A extends Adapter = Adapter,
> extends ReadVotingVault<A> {
  readonly vestingVaultContract: Contract<typeof VestingVault.abi, A>;

  constructor(config: ContractEntityConfig<A>) {
    super(config);
    this.vestingVaultContract = this.drift.contract({
      abi: VestingVault.abi,
      address: this.address,
    });
  }

  /**
   * Get the number of blocks before the delegation history is forgotten. Voting
   * power from this vault can't be used on proposals that are older than the
   * stale block lag.
   */
  getStaleBlockLag(): Promise<bigint> {
    return this.vestingVaultContract.read("staleBlockLag");
  }

  /**
   * Get this vault's token.
   */
  async getToken(): Promise<ReadToken> {
    return new ReadToken({
      address: await this.vestingVaultContract.read("token"),
      drift: this.drift,
    });
  }

  /**
   * Get this vault's unvested multiplier, a number that represents the voting
   * power of each unvested token as a percentage of a vested token. For example
   * if unvested tokens have 50% voting power compared to vested ones, this
   * value would be 50.
   */
  getUnvestedMultiplier(options?: ContractReadOptions): Promise<bigint> {
    return this.vestingVaultContract.read("unvestedMultiplier", {}, options);
  }

  /**
   * Get the grant data for a given address.
   */
  async getGrant(
    account: Address,
    options?: ContractReadOptions,
  ): Promise<Grant> {
    const {
      allocation,
      cliff,
      created,
      delegatee,
      expiration,
      latestVotingPower,
      range,
      withdrawn,
    } = await this.vestingVaultContract.read(
      "getGrant",
      { _who: account },
      options,
    );
    return {
      allocation,
      cliffBlock: cliff,
      createdBlock: created,
      delegatee,
      expirationBlock: expiration,
      latestVotingPower,
      range,
      withdrawn,
    };
  }

  /**
   * Gets the amount of tokens currently claimable from the grant.
   *
   * Mimics internal function
   * {@linkcode https://github.com/delvtech/council/blob/5f7be330b05f1c3bebd0176882cc5c3429f0764f/contracts/vaults/VestingVault.sol#L434 _getWithdrawableAmount}.
   *
   * @param account - The grantee account address.
   * @returns The amount of claimable tokens.
   */
  async getWithdrawableAmount(
    account: Address,
    options?: ContractReadOptions,
  ): Promise<bigint> {
    const { allocation, createdBlock, cliffBlock, expirationBlock, withdrawn } =
      await this.getGrant(account, options);

    let currentBlock = 0n;
    if (typeof options?.block === "bigint") {
      currentBlock = options.block;
    } else {
      const { number } = await getBlockOrThrow(this.drift, options);
      if (number === undefined) {
        return 0n;
      }
      currentBlock = number;
    }

    // funds are not unlocked
    if (currentBlock < cliffBlock) {
      return 0n;
    }

    // all funds are claimable
    if (currentBlock >= expirationBlock) {
      return allocation - withdrawn;
    }

    const vestedBlocks = currentBlock - createdBlock;
    const grantDurationBlocks = expirationBlock - createdBlock;
    const amount = fixed(allocation).mul(vestedBlocks).div(grantDurationBlocks);

    return amount.bigint - withdrawn;
  }

  /**
   * Get the current delegate of a given account.
   */
  async getDelegate(
    account: Address,
    options?: ContractReadOptions,
  ): Promise<Address> {
    const { delegatee } = await this.getGrant(account, options);
    return delegatee;
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

    return this.vestingVaultContract.read("queryVotePowerView", {
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
    const voteChangeEvents = await this.vestingVaultContract.getEvents(
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

    // Convert objects to arrays and filter out voters with no voting power.
    let breakdowns: VoterPowerBreakdown[] = [];
    for (const [
      voter,
      { votingPower, votingPowerFromDelegators, powerByDelegator },
    ] of Object.entries(breakdownByVoter)) {
      if (votingPower <= 0n) continue;
      let delegators: VoterWithPower[] = [];
      for (const [delegator, power] of Object.entries(powerByDelegator)) {
        if (votingPower <= 0n) continue;
        delegators.push({
          voter: delegator as Address,
          votingPower: power,
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
