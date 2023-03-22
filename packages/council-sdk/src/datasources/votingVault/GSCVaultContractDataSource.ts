import { GSCVault, GSCVault__factory } from "@council/typechain";
import { BigNumber, Signer } from "ethers";
import { BytesLike, formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context/context";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";

const TYPE = "GSCVault";

/**
 * A DataSource with methods for making cached calls to a `GSCVault` contract
 * from the Council protocol.
 * @category Data Sources
 */
export class GSCVaultContractDataSource extends VotingVaultContractDataSource<GSCVault> {
  /**
   * A field that can be used for more specific filtering when registering an
   * instance of this data source with the council context.
   */
  static type = TYPE;
  type = TYPE;

  constructor(address: string, context: CouncilContext) {
    super(GSCVault__factory.connect(address, context.provider), context);
  }

  /**
   * Get the amount of voting power required to join this GSC vault.
   */
  async getRequiredVotingPower(): Promise<string> {
    const reqVotingPowerBigNumber = await this.call("votingPowerBound", []);
    return formatEther(reqVotingPowerBigNumber);
  }

  /**
   * Get the time (in MS) that a new GSC member must wait after joining before
   * they can vote.
   */
  async getIdleDuration(): Promise<number> {
    const idleDurationBigNumber = await this.call("idleDuration", []);
    return idleDurationBigNumber.toNumber() * 1000;
  }

  /**
   * Get the addresses of all current members of this vault.
   * @param fromBlock - The block number to start searching for members from.
   * @param toBlock - The block number to stop searching for members at.
   */
  async getMembers(fromBlock?: number, toBlock?: number): Promise<string[]> {
    return this.cached(["getMembers", fromBlock, toBlock], async () => {
      const latestJoinTimestampByMember: Record<string, BigNumber> = {};

      const joinEvents = await this.getEvents(
        this.contract.filters.MembershipProved(),
        fromBlock,
        toBlock,
      );

      // Capture the latest join date of each address.
      for (const { args } of joinEvents) {
        const { who, when } = args;
        if (
          !latestJoinTimestampByMember[who] ||
          when.gt(latestJoinTimestampByMember[who])
        ) {
          latestJoinTimestampByMember[who] = when;
        }
      }

      const kickEvents = await this.getEvents(
        this.contract.filters.Kicked(),
        fromBlock,
        toBlock,
      );

      // Ignore addresses that were kicked after their latest join date.
      for (const { args } of kickEvents) {
        const { who, when } = args;
        // NOTE: the kickEvents store block numbers for the `when` field, so we
        // must convert them to timestamps so we can compare them with the join
        // events which store `when` as a timestamp.
        const kickedEventBlock = await this.context.provider.getBlock(
          when.toNumber(),
        );
        if (
          latestJoinTimestampByMember[who] &&
          kickedEventBlock.timestamp >
            latestJoinTimestampByMember[who]?.toNumber()
        ) {
          delete latestJoinTimestampByMember[who];
        }
      }

      return Object.keys(latestJoinTimestampByMember).map((voter) => voter);
    });
  }

  /**
   * Get a timestamp (in MS) of the join date of a given address.
   */
  async getJoinTimestamp(address: string): Promise<number | null> {
    const joinDateBigNumber = await this.call("members", [address]);
    const joinDate = joinDateBigNumber.toNumber() * 1000;
    return joinDate > 0 ? joinDate : null;
  }

  /**
   * Get the voting vaults a member joined with. Used to prove the member meets
   * the minimum voting power requirement.
   */
  getMemberVaults(address: string): Promise<string[]> {
    return this.call("getUserVaults", [address]);
  }

  /**
   * Become a member of this GSC vault.
   * @param signer - The Signer of the joining member.
   * @param vaults - The addresses of the approved vaults the joining member has
   *   voting power in. This is used to prove the joining member meets the
   *   minimum voting power requirement. If voting power is moved to a different
   *   vault, the member will become ineligible until they join again with the
   *   new vault or risk being kicked.
   * @returns The transaction hash.
   */
  async join(
    signer: Signer,
    vaults: string[],
    options?: TransactionOptions & {
      /**
       * Extra data given to the vaults to help calculation
       */
      extraVaultData?: BytesLike[];
    },
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "proveMembership",
      [vaults, options?.extraVaultData || vaults.map(() => "0x00")],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }

  /**
   * Remove a member that's become ineligible from this GSC vault. A member
   * becomes ineligible when the voting power in the vaults they joined with
   * drops below the required minimum.
   * @param signer - The Signer of the wallet paying to kick.
   * @param member - The address of the ineligible member to kick.
   * @returns The transaction hash.
   */
  async kick(
    signer: Signer,
    member: string,
    options?: TransactionOptions & {
      /**
       * The extra data the vaults need to load the member's voting power
       */
      extraVaultData?: BytesLike[];
    },
  ): Promise<string> {
    const vaults = await this.getMemberVaults(member);
    const transaction = await this.callWithSigner(
      "kick",
      [member, options?.extraVaultData || vaults.map(() => "0x00")],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }
}
