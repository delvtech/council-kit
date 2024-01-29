import { VestingVault } from "@council/artifacts/dist/VestingVault";
import {
  CachedReadContract,
  CachedReadWriteContract,
  ContractWriteOptions,
  FunctionReturn,
} from "@council/evm-client";
import Big from "big.js";
import { BlockLike, blockToReadOptions } from "src/contract/args";
import { CachedReadWriteContractFactory } from "src/contract/factory";
import {
  ReadContractModelOptions,
  ReadWriteContractModelOptions,
} from "src/models/Model";
import { ReadToken } from "src/models/token/Token";
import { ReadVoter } from "src/models/Voter";
import { VoterPowerBreakdown } from "src/models/VotingVault/types";
import { ReadVotingVault } from "src/models/VotingVault/VotingVault";
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
  protected _vestingVaultContract: CachedReadContract<VestingVaultAbi>;

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
    this._vestingVaultContract = contractFactory({
      abi: vestingVaultAbi,
      address,
      cache,
      namespace,
    });
  }

  /**
   * Get this vault's token.
   */
  async getToken(): Promise<ReadToken> {
    const address = await this._vestingVaultContract.read("token", {});
    return new ReadToken({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  /**
   * Get this vault's unvested multiplier, a number that represents the voting
   * power of each unvested token as a percentage of a vested token. For example
   * if unvested tokens have 50% voting power compared to vested ones, this
   * value would be 50.
   */
  getUnvestedMultiplier({ atBlock }: { atBlock?: BlockLike }): Promise<bigint> {
    return this._vestingVaultContract.read(
      "unvestedMultiplier",
      {},
      blockToReadOptions(atBlock),
    );
  }

  /**
   * Get the grant data for a given address.
   */
  getGrant({
    address,
    atBlock,
  }: {
    address: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<FunctionReturn<VestingVaultAbi, "getGrant">> {
    return this._vestingVaultContract.read(
      "getGrant",
      address,
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
    address,
    atBlock,
  }: {
    address: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    const { blockNumber } = await this._network.getBlock(
      blockToReadOptions(atBlock),
    );
    const { allocation, created, cliff, expiration, withdrawn } =
      await this.getGrant({
        address,
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
  }): Promise<ReadVoter[]> {
    const powerByVoter = await this._getPowerByVoter({
      fromBlock,
      toBlock,
    });
    return Object.keys(powerByVoter).map(
      (address) =>
        new ReadVoter({
          address: address as `0x${string}`,
          contractFactory: this._contractFactory,
          network: this._network,
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
    // const breakdownByVoter = await this._getPowerBreakdownByVoter(options);
    const voteChangeEvents = await this._vestingVaultContract.getEvents(
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
                contractFactory: this._contractFactory,
                network: this._network,
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
                    contractFactory: this._contractFactory,
                    network: this._network,
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
    return this._vestingVaultContract.read("staleBlockLag", {});
  }

  /**
   * Get the voting power for a given address at a given block without
   * accounting for the stale block lag.
   * @param address
   * @param atBlock
   * @returns The historical voting power of the given address.
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
      const block = await this._network.getBlock(blockToReadOptions(atBlock));
      blockNumber = block.blockNumber;
    }

    return this._vestingVaultContract.read("queryVotePowerView", {
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
    const { delegatee } = await this.getGrant({ address: voter, atBlock });
    return new ReadVoter({
      address: delegatee,
      contractFactory: this._contractFactory,
      network: this._network,
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
    const voteChangeEvents = await this._vestingVaultContract.getEvents(
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
            contractFactory: this._contractFactory,
            network: this._network,
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
    const voteChangeEvents = await this._vestingVaultContract.getEvents(
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

interface ReadWriteVestingVaultOptions extends ReadWriteContractModelOptions {}

export class ReadWriteVestingVault extends ReadVestingVault {
  protected declare _vestingVaultContract: CachedReadWriteContract<VestingVaultAbi>;
  protected declare _contractFactory: CachedReadWriteContractFactory;

  constructor(options: ReadWriteVestingVaultOptions) {
    super(options);
  }

  /**
   * Change current delegate.
   * @param signer - The Signer of the address delegating.
   * @param delegate - The address to delegate to.
   * @returns The transaction hash.
   */
  async changeDelegate({
    delegate,
    options,
  }: {
    delegate: `0x${string}`;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this._vestingVaultContract.write(
      "delegate",
      delegate,
      options,
    );
    this._contract.clearCache();
    return hash;
  }

  /**
   * Claim a grant and withdraw the tokens.
   * @param signer - The Signer of the wallet with a grant to claim.
   * @returns The transaction hash.
   */
  async claim({
    options,
  }: {
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this._vestingVaultContract.write("claim", {}, options);
    this._contract.clearCache();
    return hash;
  }
}
