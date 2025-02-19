import { GSCVault } from "@delvtech/council-artifacts/GSCVault";
import {
  Adapter,
  Address,
  Contract,
  ContractReadOptions,
} from "@delvtech/drift";
import { ContractEntityConfig } from "src/entities/Entity";
import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";
import { getBlockOrThrow } from "src/utils/getBlockOrThrow";
import { Blockish } from "src/utils/types";

/**
 * A VotingVault for the Governance Steering Council in which each member has a
 * single vote and must maintain a minimum required voting power in the core
 * voting vaults to remain eligible.
 */
export class ReadGscVault<
  A extends Adapter = Adapter,
> extends ReadVotingVault<A> {
  readonly gscVaultContract: Contract<typeof GSCVault.abi, A>;

  constructor(config: ContractEntityConfig<A>) {
    super(config);
    this.gscVaultContract = this.drift.contract({
      abi: GSCVault.abi,
      address: this.address,
    });
  }

  /**
   * Get the amount of voting power required to join this vault.
   */
  getRequiredVotingPower(options?: ContractReadOptions): Promise<bigint> {
    return this.gscVaultContract.read("votingPowerBound", {}, options);
  }

  /**
   * Get all current members of this vault.
   */
  async getMembers(
    options: {
      /**
       * The block number to start searching for members from.
       */
      fromBlock?: Blockish;
      /**
       * The block number to stop searching for members at.
       */
      toBlock?: Blockish;
    } = {},
  ): Promise<Address[]> {
    const latestJoinTimestampByMember: {
      [member: Address]: bigint;
    } = {};

    const joinEvents = await this.gscVaultContract.getEvents(
      "MembershipProved",
      options,
    );

    // Capture the latest join date of each address.
    for (const {
      args: { who, when },
    } of joinEvents) {
      if (when > (latestJoinTimestampByMember[who] || -1n)) {
        latestJoinTimestampByMember[who] = when;
      }
    }

    const kickEvents = await this.gscVaultContract.getEvents("Kicked", options);

    // Ignore addresses that were kicked after their latest join date.
    for (const {
      args: { who, when },
    } of kickEvents) {
      // NOTE: the kickEvents store `when` as a block number whereas the
      // joinEvents store `when` as a timestamp, so we must convert the block
      // number to a timestamp so we can compare them.
      const { timestamp: kickedTimestamp } = await getBlockOrThrow(this.drift, {
        blockNumber: when,
      });

      if (
        latestJoinTimestampByMember[who] &&
        kickedTimestamp > latestJoinTimestampByMember[who]
      ) {
        delete latestJoinTimestampByMember[who];
      }
    }

    return Object.keys(latestJoinTimestampByMember) as Address[];
  }

  /**
   * Get the join date of a given address.
   */
  async getJoinDate(
    member: Address,
    options?: ContractReadOptions,
  ): Promise<Date | undefined> {
    const secondsTimestamp = await this.gscVaultContract.read(
      "members",
      [member],
      options,
    );
    return secondsTimestamp
      ? new Date(Number(secondsTimestamp * 1000n))
      : undefined;
  }

  /**
   * Get a boolean indicating whether a given voter is a current member.
   */
  async getIsMember(
    voter: Address,
    options?: ContractReadOptions,
  ): Promise<boolean> {
    return !!(await this.getJoinDate(voter, options));
  }

  /**
   * Get the time (in MS) that a new GSC member must wait after joining before
   * they can vote.
   */
  async getIdleDuration(options?: ContractReadOptions): Promise<bigint> {
    const seconds = await this.gscVaultContract.read(
      "idleDuration",
      {},
      options,
    );
    return seconds * 1000n;
  }

  /**
   * Get a boolean indicating whether a member is still in the idle duration.
   * Idle members cannot vote.
   */
  async getIsIdle(
    member: Address,
    options?: ContractReadOptions,
  ): Promise<boolean> {
    const joinDate = await this.getJoinDate(member, options);
    const isMember = !!joinDate;
    return (
      isMember &&
      joinDate.getTime() + Number(await this.getIdleDuration(options)) >
        Date.now()
    );
  }

  /**
   * Get the voting vaults a member joined with. Used to prove the member meets
   * the minimum voting power requirement.
   */
  async getMemberVaults(
    member: Address,
    options?: ContractReadOptions,
  ): Promise<ReadVotingVault[]> {
    const vaultAddresses = await this.gscVaultContract.read(
      "getUserVaults",
      { who: member },
      options,
    );
    return vaultAddresses.map(
      (address) =>
        new ReadVotingVault({
          address,
          drift: this.drift,
        }),
    );
  }
}
