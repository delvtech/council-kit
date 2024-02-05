import { VestingVault } from "@council/artifacts/VestingVault";
import { CachedReadContract, FunctionReturn } from "@council/evm-client";
import Big from "big.js";
import { ReadContractModelOptions } from "src/models/Model";
import { ReadVoter } from "src/models/ReadVoter";
import { ReadToken } from "src/models/token/ReadToken";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";
import { VoterPowerBreakdown } from "src/models/votingVault/types";
import { BlockLike, blockToReadOptions } from "src/utils/blockToReadOptions";
import { getBlock } from "src/utils/getBlock";
import { getOrSet } from "src/utils/getOrSet";

const vestingVaultAbi = VestingVault.abi;
type VestingVaultAbi = typeof vestingVaultAbi;

export interface ReadVestingVaultOptions extends ReadContractModelOptions {}

/**
 * A VotingVault that gives voting power for receiving grants and applies a
 * multiplier on unvested tokens to reduce their voting power.
 * @category Models
 */
export class ReadVestingVault extends ReadVotingVault {
  vestingVaultContract: CachedReadContract<VestingVaultAbi>;

  constructor({
    address,
    contractFactory,
    network,
    cache,
    namespace,
    name,
  }: ReadVestingVaultOptions) {
    super({
      address,
      contractFactory,
      network,
      cache,
      namespace,
      name,
    });
    this.vestingVaultContract = contractFactory({
      abi: vestingVaultAbi,
      address,
      cache,
      namespace,
    });
  }

  get address(): `0x${string}` {
    return this.contract.address;
  }
  get namespace(): string | undefined {
    return this.contract.namespace;
  }

  /**
   * Get this vault's token.
   */
  async getToken(): Promise<ReadToken> {
    return new ReadToken({
      address: await this.vestingVaultContract.read("token"),
      contractFactory: this.contractFactory,
      network: this.network,
    });
  }

  /**
   * Get this vault's unvested multiplier, a number that represents the voting
   * power of each unvested token as a percentage of a vested token. For example
   * if unvested tokens have 50% voting power compared to vested ones, this
   * value would be 50.
   */
  getUnvestedMultiplier({
    atBlock,
  }: { atBlock?: BlockLike } = {}): Promise<bigint> {
    return this.vestingVaultContract.read(
      "unvestedMultiplier",
      undefined,
      blockToReadOptions(atBlock),
    );
  }

  /**
   * Get the grant data for a given address.
   */
  getGrant({
    voter,
    atBlock,
  }: {
    voter: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<FunctionReturn<VestingVaultAbi, "getGrant">> {
    return this.vestingVaultContract.read(
      "getGrant",
      voter instanceof ReadVoter ? voter.address : voter,
      blockToReadOptions(atBlock),
    );
  }

  /**
   * Gets the amount of tokens currently claimable from the grant.
   * Mimics internal function https://github.com/delvtech/council/blob/main/contracts/vaults/VestingVault.sol#L434
   * @param address - The grantee address.
   * @returns The amount of claimable tokens.
   */
  async getWithdrawableAmount({
    voter,
    atBlock,
  }: {
    voter: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    let blockNumber = atBlock;

    if (typeof blockNumber !== "bigint") {
      const block = await getBlock(this.network, blockNumber);
      blockNumber = block.blockNumber;
    }

    const { allocation, created, cliff, expiration, withdrawn } =
      await this.getGrant({
        voter,
        atBlock,
      });

    // funds are not unlocked
    if (blockNumber < cliff) {
      return 0n;
    }

    // all funds are claimable
    if (blockNumber >= expiration) {
      return allocation - withdrawn;
    }

    const blocksSinceCreated = blockNumber - created;
    const grantDuration = expiration - created;
    const amount = Big(String(allocation))
      .mul(String(blocksSinceCreated))
      .div(String(grantDuration));

    return BigInt(amount.toFixed()) - withdrawn;
  }

  /**
   * Get all participants that have voting power in this vault.
   * @param fromBlock - Include all voters that had power on or after this block number.
   * @param toBlock - Include all voters that had power on or before this block number.
   */
  async getVoters({
    fromBlock,
    toBlock,
  }: {
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  } = {}): Promise<ReadVoter[]> {
    const powerByVoter = await this._getPowerByVoter({
      fromBlock,
      toBlock,
    });
    return Object.keys(powerByVoter).map(
      (address) =>
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
  } = {}): Promise<VoterPowerBreakdown[]> {
    // const breakdownByVoter = await this._getPowerBreakdownByVoter(options);
    const voteChangeEvents = await this.vestingVaultContract.getEvents(
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
    return this.vestingVaultContract.read("staleBlockLag");
  }

  /**
   * Get the voting power for a given address at a given block without
   * accounting for the stale block lag.
   * @param voter
   * @param atBlock
   * @returns The historical voting power of the given address.
   */
  async getHistoricalVotingPower({
    voter,
    atBlock,
  }: {
    voter: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    let blockNumber = atBlock;

    if (typeof blockNumber !== "bigint") {
      const block = await getBlock(this.network, blockNumber);
      blockNumber = block.blockNumber;
    }

    return this.vestingVaultContract.read("queryVotePowerView", {
      user: voter instanceof ReadVoter ? voter.address : voter,
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
  } = {}): Promise<bigint> {
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
    voter: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<ReadVoter> {
    const { delegatee } = await this.getGrant({
      voter,
      atBlock,
    });
    return new ReadVoter({
      address: delegatee,
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
    const voteChangeEvents = await this.vestingVaultContract.getEvents(
      "VoteChange",
      {
        filter: {
          to: address,
        },
        toBlock: atBlock,
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
  } = {}): Promise<Record<`0x${string}`, bigint>> {
    const voteChangeEvents = await this.vestingVaultContract.getEvents(
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
