import { LockingVault } from "@council/artifacts/LockingVault";
import { CachedReadContract } from "@council/evm-client";
import { ReadContractModelOptions } from "src/models/Model";
import { ReadVoter } from "src/models/ReadVoter";
import { ReadToken } from "src/models/token/ReadToken";
import { LockingVaultAbi } from "src/models/votingVault/lockingVault/types";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";
import { VoterPowerBreakdown } from "src/models/votingVault/types";
import { BlockLike, blockToReadOptions } from "src/utils/blockToReadOptions";
import { getBlock } from "src/utils/getBlock";
import { getOrSet } from "src/utils/getOrSet";

export interface ReadLockingVaultOptions extends ReadContractModelOptions {}

/**
 * A VotingVault that gives voting power for depositing tokens.
 * @category Models
 */
export class ReadLockingVault extends ReadVotingVault {
  lockingVaultContract: CachedReadContract<LockingVaultAbi>;

  constructor({
    address,
    contractFactory,
    network,
    cache,
    namespace,
    name,
  }: ReadLockingVaultOptions) {
    super({
      address,
      contractFactory,
      network,
      cache,
      namespace,
      name,
    });
    this.lockingVaultContract = contractFactory({
      abi: LockingVault.abi,
      address,
      cache,
      namespace,
    });
  }

  /**
   * Get the associated token for this LockingVault.
   */
  async getToken(): Promise<ReadToken> {
    return new ReadToken({
      address: await this.lockingVaultContract.read("token"),
      contractFactory: this.contractFactory,
      network: this.network,
    });
  }

  /**
   * Get the amount of tokens that a given `address` has deposited into this
   * vault.
   */
  async getDepositedBalance({
    voter,
    atBlock,
  }: {
    voter: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    const deposits = await this.lockingVaultContract.read(
      "deposits",
      voter instanceof ReadVoter ? voter.address : voter,
      blockToReadOptions(atBlock),
    );
    return deposits[1];
  }

  get address(): `0x${string}` {
    return this.contract.address;
  }
  get namespace(): string | undefined {
    return this.contract.namespace;
  }

  /**
   * Get all participants with voting power in this vault.
   * @param fromBlock - Include all voters that had power on or after this block number.
   * @param toBlock - Include all voters that had power on or before this block number.
   */
  async getVoters({
    fromBlock,
    toBlock,
  }: {
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  }): Promise<ReadVoter[]> {
    const powerByVoter = await this._getPowerByVoter({
      fromBlock,
      toBlock,
    });
    return Object.keys(powerByVoter).map(
      ([address]) =>
        new ReadVoter({
          address: address as `0x${string}`,
          contractFactory: this.contractFactory,
          network: this.network,
        }),
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
  async getVotingPowerBreakdown({
    address,
    fromBlock,
    toBlock,
  }: {
    address?: `0x${string}`;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  }): Promise<VoterPowerBreakdown[]> {
    const voteChangeEvents = await this.lockingVaultContract.getEvents(
      "VoteChange",
      {
        filter: {
          to: address,
        },
        fromBlock,
        toBlock,
      },
    );

    const breakdownByVoter: Record<
      `0x${string}`,
      {
        power: bigint;
        powerFromAllDelegators: bigint;
        powerByDelegator: Record<`0x${string}`, bigint>;
      }
    > = {};

    for (const {
      args: { from, to, amount },
    } of voteChangeEvents) {
      if (!breakdownByVoter[to]) {
        breakdownByVoter[to] = {
          power: 0n,
          powerFromAllDelegators: 0n,
          powerByDelegator: {},
        };
      }

      breakdownByVoter[to].power += amount;

      // ignore self-delegation
      if (from !== to) {
        breakdownByVoter[to].powerFromAllDelegators += amount;
        breakdownByVoter[to].powerByDelegator[from] =
          breakdownByVoter[to].powerByDelegator[from] ?? 0n + amount;
      }
    }

    const voterMap = new Map<`0x${string}`, ReadVoter>();

    return Object.entries(breakdownByVoter)
      .filter(([, { power }]) => power > 0)
      .map(
        ([_address, { power, powerByDelegator, powerFromAllDelegators }]) => {
          const address = _address as `0x${string}`;

          const voter = getOrSet({
            key: address,
            cache: voterMap,
            callback: () =>
              new ReadVoter({
                address,
                contractFactory: this.contractFactory,
                network: this.network,
              }),
          });

          const votingPowerByDelegator = Object.entries(powerByDelegator)
            .filter(([, votingPower]) => votingPower > 0n)
            .map(([_address, votingPower]) => {
              const address = _address as `0x${string}`;
              const voter = getOrSet({
                key: address,
                cache: voterMap,
                callback: () =>
                  new ReadVoter({
                    address,
                    contractFactory: this.contractFactory,
                    network: this.network,
                  }),
              });
              return {
                voter,
                votingPower,
              };
            });

          return {
            voter,
            votingPower: power,
            votingPowerFromAllDelegators: powerFromAllDelegators,
            votingPowerByDelegator,
          };
        },
      );
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
   * Get the voting power for a given address at a given block without
   * accounting for the stale block lag.
   */
  async getHistoricalVotingPower({
    address,
    atBlock,
  }: {
    address: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    let blockNumber = atBlock;

    if (typeof blockNumber !== "bigint") {
      const block = await getBlock(this.network, atBlock);
      blockNumber = block.blockNumber;
    }

    return this.lockingVaultContract.read("queryVotePowerView", {
      user: address,
      blockNumber,
    });
  }

  /**
   * Get the sum of voting power held by all voters in this vault.
   * @param atBlock - Get the total held at this block number.
   */
  async getTotalVotingPower({
    atBlock,
  }: {
    atBlock?: BlockLike;
  }): Promise<bigint> {
    const powerByVoter = await this._getPowerByVoter({
      toBlock: atBlock,
    });
    return Object.values(powerByVoter).reduce((sum, power) => sum + power);
  }

  /**
   * Get the current delegate of a given address.
   */
  async getDelegate({
    voter,
    atBlock,
  }: {
    voter: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<ReadVoter> {
    const { 0: address } = await this.lockingVaultContract.read(
      "deposits",
      voter,
      blockToReadOptions(atBlock),
    );
    return new ReadVoter({
      address,
      contractFactory: this.contractFactory,
      network: this.network,
    });
  }

  /**
   * Get all voters delegated to a given address in this vault.
   */
  async getDelegatorsTo({
    address,
    atBlock,
  }: {
    address: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<ReadVoter[]> {
    let toBlock = atBlock;

    if (typeof toBlock !== "bigint") {
      const { blockNumber } = await getBlock(this.network, toBlock);
      toBlock = blockNumber;
    }

    const voteChangeEvents = await this.lockingVaultContract.getEvents(
      "VoteChange",
      {
        filter: {
          to: address,
        },
        toBlock,
      },
    );

    const powerByDelegators: Record<`0x${string}`, bigint> = {};
    for (const {
      args: { from, amount },
    } of voteChangeEvents) {
      // ignore self-delegation
      if (from !== address) {
        powerByDelegators[from] = powerByDelegators[from] ?? 0n + amount;
      }
    }

    return Object.entries(powerByDelegators)
      .filter(([, power]) => power > 0)
      .map(
        ([address]) =>
          new ReadVoter({
            address: address as `0x${string}`,
            contractFactory: this.contractFactory,
            network: this.network,
          }),
      );
  }

  private async _getPowerByVoter({
    address,
    fromBlock,
    toBlock,
  }: {
    address?: `0x${string}`;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  }): Promise<Record<`0x${string}`, bigint>> {
    const voteChangeEvents = await this.lockingVaultContract.getEvents(
      "VoteChange",
      {
        filter: {
          to: address,
        },
        fromBlock,
        toBlock,
      },
    );

    const powerByVoter: Record<`0x${string}`, bigint> = {};
    for (const {
      args: { to, amount },
    } of voteChangeEvents) {
      powerByVoter[to] = powerByVoter[to] ?? 0n + amount;
    }

    return Object.fromEntries(
      Object.entries(powerByVoter).filter(([, power]) => power > 0n),
    );
  }
}
