import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { CachedReadContract } from "@delvtech/evm-client";
import Big from "big.js";
import { ReadContractModelOptions } from "src/entities/Model";
import { ReadVoter } from "src/entities/ReadVoter";
import { ReadToken } from "src/entities/token/ReadToken";
import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";
import { VoterPowerBreakdown } from "src/entities/votingVault/types";
import {
  Grant,
  VestingVaultAbi,
} from "src/entities/votingVault/vestingVault/types";
import { BlockLike, blockToReadOptions } from "src/utils/blockToReadOptions";
import { getBlockOrThrow } from "src/utils/getBlockOrThrow";
import { getOrSet } from "src/utils/getOrSet";

export interface ReadVestingVaultOptions extends ReadContractModelOptions {}

/**
 * A VotingVault that gives voting power for receiving grants and applies a
 * multiplier on unvested tokens to reduce their voting power.
 * @category Models
 */
export class ReadVestingVault extends ReadVotingVault {
  vestingVaultContract: CachedReadContract<VestingVaultAbi>;

  constructor({
    name = "Vesting Vault",
    address,
    contractFactory,
    network,
    cache,
    namespace,
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
      abi: VestingVault.abi,
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
    account,
    atBlock,
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<Grant> {
    return this.vestingVaultContract.read(
      "getGrant",
      {
        _who: typeof account === "string" ? account : account.address,
      },
      blockToReadOptions(atBlock),
    );
  }

  /**
   * Gets the amount of tokens currently claimable from the grant.
   * Mimics internal function https://github.com/delvtech/council/blob/main/contracts/vaults/VestingVault.sol#L434
   * @param account - The grantee account address.
   * @returns The amount of claimable tokens.
   */
  async getWithdrawableAmount({
    account,
    atBlock,
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    let blockNumber = atBlock;

    if (typeof blockNumber !== "bigint") {
      const block = await getBlockOrThrow(this.network, blockNumber);
      if (block.blockNumber === null) {
        return 0n;
      }
      blockNumber = block.blockNumber;
    }

    const { allocation, created, cliff, expiration, withdrawn } =
      await this.getGrant({
        account: account,
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
   * @param account - Get a breakdown for a specific account.
   * @param fromBlock - Include all voters that had power on or after this block
   * number.
   * @param toBlock - Include all voters that had power on or before this block
   * number.
   */
  async getVotingPowerBreakdown({
    account,
    fromBlock,
    toBlock,
  }: {
    account?: `0x${string}`;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  } = {}): Promise<VoterPowerBreakdown[]> {
    // const breakdownByVoter = await this._getPowerBreakdownByVoter(options);
    const voteChangeEvents = await this.vestingVaultContract.getEvents(
      "VoteChange",
      {
        filter: {
          to: account,
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
          (breakdownByVoter[to].powerByDelegator[from] ?? 0n) + amount;
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
   * @param account
   * @param atBlock
   * @returns The historical voting power of the given address.
   */
  async getHistoricalVotingPower({
    account,
    atBlock,
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    let blockNumber = atBlock;

    if (typeof blockNumber !== "bigint") {
      const block = await getBlockOrThrow(this.network, blockNumber);
      if (block.blockNumber === null) {
        return 0n;
      }
      blockNumber = block.blockNumber;
    }

    return this.vestingVaultContract.read("queryVotePowerView", {
      user: typeof account === "string" ? account : account.address,
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
    return Object.values(powerByVoter).reduce((sum, power) => sum + power, 0n);
  }

  /**
   * Get the current delegate of a given account.
   */
  async getDelegate({
    account,
    atBlock,
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<ReadVoter> {
    const { delegatee } = await this.getGrant({
      account,
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
    account,
    atBlock,
  }: {
    account: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<ReadVoter[]> {
    const voteChangeEvents = await this.vestingVaultContract.getEvents(
      "VoteChange",
      {
        filter: {
          to: account,
        },
        toBlock: atBlock,
      },
    );

    const powerByDelegators: Record<`0x${string}`, bigint> = {};
    for (const {
      args: { from, amount },
    } of voteChangeEvents) {
      // ignore self-delegation
      if (from !== account) {
        powerByDelegators[from] = (powerByDelegators[from] ?? 0n) + amount;
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
      powerByVoter[to] = (powerByVoter[to] ?? 0n) + amount;
    }

    return Object.fromEntries(
      Object.entries(powerByVoter).filter(([, power]) => power > 0n),
    );
  }
}
