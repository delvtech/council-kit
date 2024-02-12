import { GSCVault } from "@council/artifacts/GSCVault";
import { CachedReadContract } from "@delvtech/evm-client";
import { ReadContractModelOptions } from "src/models/Model";
import { ReadVoter } from "src/models/ReadVoter";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";
import { BlockLike, blockToReadOptions } from "src/utils/blockToReadOptions";
import { getBlock } from "src/utils/getBlock";
import { GscVaultAbi } from "./types";

export interface ReadGscVaultOptions extends ReadContractModelOptions {}

/**
 * A VotingVault for the Governance Steering Council in which each member has a
 * single vote and must maintain a minimum required voting power in the core
 * voting vaults to remain eligible.
 * @category Models
 */
export class ReadGscVault extends ReadVotingVault {
  gscVaultContract: CachedReadContract<GscVaultAbi>;

  constructor({
    address,
    contractFactory,
    network,
    cache,
    namespace,
    name,
  }: ReadGscVaultOptions) {
    super({
      address,
      contractFactory,
      network,
      cache,
      namespace,
      name,
    });
    this.gscVaultContract = contractFactory({
      abi: GSCVault.abi,
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
   * Get the amount of voting power required to join this vault.
   */
  getRequiredVotingPower({
    atBlock,
  }: {
    atBlock?: BlockLike;
  } = {}): Promise<bigint> {
    return this.gscVaultContract.read(
      "votingPowerBound",
      undefined,
      blockToReadOptions(atBlock),
    );
  }

  /**
   * Get all current members of this vault.
   * @param fromBlock - The block number to start searching for members from.
   * @param toBlock - The block number to stop searching for members at.
   */
  async getMembers({
    fromBlock,
    toBlock,
  }: {
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  } = {}): Promise<ReadVoter[]> {
    const latestJoinTimestampByMember: Record<`0x${string}`, bigint> = {};

    const joinEvents = await this.gscVaultContract.getEvents(
      "MembershipProved",
      {
        fromBlock,
        toBlock,
      },
    );

    // Capture the latest join date of each address.
    for (const {
      args: { who, when },
    } of joinEvents) {
      if (
        !latestJoinTimestampByMember[who] ||
        when > latestJoinTimestampByMember[who]
      ) {
        latestJoinTimestampByMember[who] = when;
      }
    }

    const kickEvents = await this.gscVaultContract.getEvents("Kicked", {
      fromBlock,
      toBlock,
    });

    // Ignore addresses that were kicked after their latest join date.
    for (const {
      args: { who, when },
    } of kickEvents) {
      // NOTE: the kickEvents store `when` as a block number whereas the
      // joinEvents store `when` as a timestamp, so we must convert the block
      // number to a timestamp so we can compare them.
      const { timestamp: kickedTimestamp } = await getBlock(this.network, when);

      if (
        latestJoinTimestampByMember[who] &&
        kickedTimestamp > latestJoinTimestampByMember[who]
      ) {
        delete latestJoinTimestampByMember[who];
      }
    }

    return Object.entries(latestJoinTimestampByMember).map(
      ([address]) =>
        new ReadVoter({
          address: address as `0x${string}`,
          contractFactory: this.contractFactory,
          network: this.network,
        }),
    );
  }

  /**
   * Get all voters with voting power in this vault (alias for `getMembers`).
   * @param fromBlock - The block number to start searching for voters from.
   * @param toBlock - The block number to stop searching for voters at.
   */
  getVoters(
    ...args: Parameters<ReadGscVault["getMembers"]>
  ): Promise<ReadVoter[]> {
    return this.getMembers(...args);
  }

  /**
   * Get the join date of a given address.
   */
  async getJoinDate({
    account,
    atBlock,
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<Date | null> {
    const secondsTimestamp = await this.gscVaultContract.read(
      "members",
      typeof account === "string" ? account : account.address,
      blockToReadOptions(atBlock),
    );
    return secondsTimestamp ? new Date(Number(secondsTimestamp * 1000n)) : null;
  }

  /**
   * Get a boolean indicating whether a given voter is a current member.
   */
  async getIsMember({
    account,
    atBlock,
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<boolean> {
    return !!(await this.getJoinDate({
      account,
      atBlock,
    }));
  }

  /**
   * Get the time (in MS) that a new GSC member must wait after joining before
   * they can vote.
   */
  getIdleDuration({ atBlock }: { atBlock?: BlockLike } = {}): Promise<bigint> {
    return this.gscVaultContract.read(
      "idleDuration",
      undefined,
      blockToReadOptions(atBlock),
    );
  }

  /**
   * Get a boolean indicating whether a member is still in the idle duration.
   * Idle members cannot vote.
   */
  async getIsIdle({
    account,
    atBlock,
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<boolean> {
    const joinDate = await this.getJoinDate({
      account,
      atBlock,
    });
    const isMember = !!joinDate;
    return (
      isMember &&
      joinDate.getTime() +
        Number(
          await this.getIdleDuration({
            atBlock,
          }),
        ) >
        Date.now()
    );
  }

  /**
   * Get the voting vaults a member joined with. Used to prove the member meets
   * the minimum voting power requirement.
   */
  async getMemberVaults({
    account,
    atBlock,
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<ReadVotingVault[]> {
    const vaultAddresses = await this.gscVaultContract.read(
      "getUserVaults",
      typeof account === "string" ? account : account.address,
      blockToReadOptions(atBlock),
    );
    return vaultAddresses.map(
      (address) =>
        new ReadVotingVault({
          address,
          contractFactory: this.contractFactory,
          network: this.network,
        }),
    );
  }
}
