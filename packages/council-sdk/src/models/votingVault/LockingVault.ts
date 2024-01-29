import { LockingVault } from "@council/artifacts/dist/LockingVault";
import {
  CachedReadContract,
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@council/evm-client";
import { BlockLike, blockToReadOptions } from "src/contract/args";
import { CachedReadWriteContractFactory } from "src/contract/factory";
import {
  ReadContractModelOptions,
  ReadWriteContractModelOptions,
} from "src/models/Model";
import { ReadToken } from "src/models/token/Token";
import { ReadVoter } from "src/models/Voter";
import { VoterPowerBreakdown } from "src/models/votingVault/types";
import { getOrSet } from "src/utils/getOrSet";
import { ReadVotingVault } from "./VotingVault";

const lockingVaultAbi = LockingVault.abi;
type LockingVaultAbi = typeof lockingVaultAbi;

export interface ReadLockingVaultOptions extends ReadContractModelOptions {}

/**
 * A VotingVault that gives voting power for depositing tokens.
 * @category Models
 */
export class ReadLockingVault extends ReadVotingVault {
  protected _lockingVaultContract: CachedReadContract<LockingVaultAbi>;
  constructor({
    address,
    contractFactory,
    cache,
    id,
    ...rest
  }: ReadLockingVaultOptions) {
    super({
      address,
      contractFactory,
      cache,
      id,
      ...rest,
    });
    this._lockingVaultContract = contractFactory({
      abi: lockingVaultAbi,
      address,
      cache,
      id,
    });
  }

  /**
   * Get the associated token for this LockingVault.
   */
  async getToken(): Promise<ReadToken> {
    const address = await this._lockingVaultContract.read("token", {});
    return new ReadToken({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  /**
   * Get the amount of tokens that a given `address` has deposited into this
   * vault.
   */
  async getDepositedBalance({
    address,
    atBlock,
  }: {
    address: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    const [, balance] = await this._lockingVaultContract.read(
      "deposits",
      address,
      blockToReadOptions(atBlock),
    );
    return balance;
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
    const voteChangeEvents = await this._lockingVaultContract.getEvents(
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
    return this._lockingVaultContract.read("staleBlockLag", {});
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
      const block = await this._network.getBlock(blockToReadOptions(atBlock));
      blockNumber = block.blockNumber;
    }

    return this._lockingVaultContract.read("queryVotePowerView", {
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
    const [address] = await this._lockingVaultContract.read(
      "deposits",
      voter,
      blockToReadOptions(atBlock),
    );
    return new ReadVoter({
      address,
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
    let toBlock = atBlock;

    if (typeof toBlock !== "bigint") {
      const { blockNumber } = await this._network.getBlock(
        blockToReadOptions(atBlock),
      );
      toBlock = blockNumber;
    }

    const voteChangeEvents = await this._lockingVaultContract.getEvents(
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
    const voteChangeEvents = await this._lockingVaultContract.getEvents(
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

export interface ReadWriteLockingVaultOptions
  extends ReadWriteContractModelOptions {}

export class ReadWriteLockingVault extends ReadLockingVault {
  protected declare _lockingVaultContract: CachedReadWriteContract<LockingVaultAbi>;
  protected declare _contractFactory: CachedReadWriteContractFactory;

  constructor(options: ReadWriteLockingVaultOptions) {
    super(options);
  }

  /**
   * Change current delegate.
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
    const hash = await this._lockingVaultContract.write(
      "changeDelegation",
      delegate,
      options,
    );
    this._contract.clearCache();
    return hash;
  }

  /**
   * Deposit tokens into this vault.
   * @param account - The address to credit this deposit to.
   * @param amount - The amount of tokens to deposit. (formatted decimal string)
   * @param firstDelegate - The address to delegate the resulting voting power to
   *   if the account doesn't already have a delegate.
   * @returns The transaction hash.
   */
  async deposit({
    account,
    amount,
    firstDelegate,
    options,
  }: {
    account: `0x${string}`;
    amount: bigint;
    firstDelegate?: `0x${string}`;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this._lockingVaultContract.write(
      "deposit",
      {
        amount,
        fundedAccount: account,
        firstDelegation: firstDelegate ?? account,
      },
      options,
    );
    this._contract.clearCache();
    return hash;
  }

  /**
   * Withdraw tokens from this vault.
   * @param amount - The amount of tokens to withdraw. (formatted decimal string)
   * @returns The transaction hash.
   */
  async withdraw({
    amount,
    options,
  }: {
    amount: bigint;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this._lockingVaultContract.write(
      "withdraw",
      amount,
      options,
    );
    this._contract.clearCache();
    return hash;
  }
}
