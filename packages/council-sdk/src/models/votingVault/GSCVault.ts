import { GSCVault } from "@council/artifacts/dist/GSCVault";
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
import { ReadVoter } from "src/models/Voter";
import { ReadVotingVault } from "src/models/VotingVault/VotingVault";

const gscVaultAbi = GSCVault.abi;
type GSCVaultAbi = typeof gscVaultAbi;

export interface ReadGSCVaultOptions extends ReadContractModelOptions {}

/**
 * A VotingVault for the Governance Steering Council in which each member has a
 * single vote and must maintain a minimum required voting power in the core
 * voting vaults to remain eligible.
 * @category Models
 */
export class ReadGSCVault extends ReadVotingVault {
  protected _gscVaultContract: CachedReadContract<GSCVaultAbi>;

  constructor({
    address,
    contractFactory,
    network,
    cache,
    namespace,
    name,
  }: ReadGSCVaultOptions) {
    super({
      address,
      contractFactory,
      network,
      cache,
      namespace,
      name,
    });
    this._gscVaultContract = contractFactory({
      abi: gscVaultAbi,
      address,
      cache,
      namespace,
    });
  }

  /**
   * Get the amount of voting power required to join this vault.
   */
  getRequiredVotingPower({
    atBlock,
  }: {
    atBlock?: BlockLike;
  }): Promise<bigint> {
    return this._gscVaultContract.read(
      "votingPowerBound",
      {},
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
  }): Promise<ReadVoter[]> {
    const latestJoinTimestampByMember: Record<`0x${string}`, bigint> = {};

    const joinEvents = await this._gscVaultContract.getEvents(
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

    const kickEvents = await this._gscVaultContract.getEvents("Kicked", {
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
      const { timestamp: kickedTimestamp } = await this._network.getBlock({
        blockNumber: when,
      });

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
          contractFactory: this._contractFactory,
          network: this._network,
        }),
    );
  }

  /**
   * Get all voters with voting power in this vault (alias for `getMembers`).
   * @param fromBlock - The block number to start searching for voters from.
   * @param toBlock - The block number to stop searching for voters at.
   */
  getVoters(
    ...args: Parameters<ReadGSCVault["getMembers"]>
  ): Promise<ReadVoter[]> {
    return this.getMembers(...args);
  }

  /**
   * Get the join date of a given address.
   */
  async getJoinDate({
    member,
    atBlock,
  }: {
    member: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<Date | null> {
    const secondsTimestamp = await this._gscVaultContract.read(
      "members",
      typeof member === "string" ? member : member.address,
      blockToReadOptions(atBlock),
    );
    return secondsTimestamp ? new Date(Number(secondsTimestamp * 1000n)) : null;
  }

  /**
   * Get a boolean indicating whether a given voter is a current member.
   */
  async getIsMember({
    voter,
    atBlock,
  }: {
    voter: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<boolean> {
    return !!(await this.getJoinDate({
      member: voter,
      atBlock,
    }));
  }

  /**
   * Get the time (in MS) that a new GSC member must wait after joining before
   * they can vote.
   */
  getIdleDuration({ atBlock }: { atBlock?: BlockLike }): Promise<bigint> {
    return this._gscVaultContract.read(
      "idleDuration",
      {},
      blockToReadOptions(atBlock),
    );
  }

  /**
   * Get a boolean indicating whether a member is still in the idle duration.
   * Idle members cannot vote.
   */
  async getIsIdle({
    member,
    atBlock,
  }: {
    member: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<boolean> {
    const joinDate = await this.getJoinDate({
      member,
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
    member,
    atBlock,
  }: {
    member: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<ReadVotingVault[]> {
    const vaultAddresses = await this._gscVaultContract.read(
      "getUserVaults",
      typeof member === "string" ? member : member.address,
      blockToReadOptions(atBlock),
    );
    return vaultAddresses.map(
      (address) =>
        new ReadVotingVault({
          address,
          contractFactory: this._contractFactory,
          network: this._network,
        }),
    );
  }
}

export interface ReadWriteGSCVaultOptions
  extends ReadWriteContractModelOptions {}

export class ReadWriteGSCVault extends ReadGSCVault {
  protected declare _gscVaultContract: CachedReadWriteContract<GSCVaultAbi>;
  protected declare _contractFactory: CachedReadWriteContractFactory;

  constructor(options: ReadWriteGSCVaultOptions) {
    super(options);
  }

  /**
   * Become a member of this GSC vault.
   * @param vaults - The addresses of the approved vaults the joining member has
   *   voting power in. This is used to prove the joining member meets the
   *   minimum voting power requirement. If voting power is moved to a different
   *   vault, the member will become ineligible until they join again with the
   *   new vault or risk being kicked.
   * @returns The transaction hash.
   */
  async join({
    vaults,
    extraVaultData = [],
    options,
  }: {
    vaults: (ReadVotingVault | `0x${string}`)[];
    /**
     * Extra data given to the vaults to help calculation
     */
    extraVaultData?: `0x${string}`[];
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const vaultAddresses = vaults.map((vault) =>
      typeof vault === "string" ? vault : vault.address,
    );
    const hash = await this._gscVaultContract.write(
      "proveMembership",
      {
        extraData: extraVaultData,
        votingVaults: vaultAddresses,
      },
      options,
    );
    this._contract.clearCache();
    return hash;
  }

  /**
   * Remove a member that's become ineligible from this GSC vault. A member
   * becomes ineligible when the voting power in the vaults they joined with
   * drops below the required minimum.
   * @param member - The address of the ineligible member to kick.
   * @returns The transaction hash.
   */
  async kick({
    member,
    extraVaultData = [],
    options,
  }: {
    member: ReadVoter | `0x${string}`;
    /**
     * The extra data the vaults need to load the member's voting power
     */
    extraVaultData?: `0x${string}`[];
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this._gscVaultContract.write(
      "kick",
      {
        extraData: extraVaultData,
        who: typeof member === "string" ? member : member.address,
      },
      options,
    );
    this._contract.clearCache();
    return hash;
  }
}
