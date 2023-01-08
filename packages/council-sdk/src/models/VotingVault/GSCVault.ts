import { BytesLike, Signer } from "ethers";
import { CouncilContext } from "src/context";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { GSCVaultContractDataSource } from "src/datasources/VotingVault/GSCVaultContractDataSource";
import { Voter } from "src/models/Voter";
import { VotingVault, VotingVaultOptions } from "./VotingVault";

export interface GSCVaultOptions extends VotingVaultOptions {
  dataSource?: GSCVaultContractDataSource;
}

/**
 * A VotingVault for the Governance Steering Council in which each member has a
 * single vote and must maintain a minimum required voting power in the core
 * voting vaults to remain eligible.
 * @category Models
 */
export class GSCVault extends VotingVault<GSCVaultContractDataSource> {
  constructor(
    address: string,
    context: CouncilContext,
    options?: GSCVaultOptions,
  ) {
    super(address, context, {
      ...options,
      name: options?.name ?? "GSC Vault",
      dataSource:
        options?.dataSource ??
        context.registerDataSource(
          { address },
          new GSCVaultContractDataSource(address, context),
        ),
    });
  }

  /**
   * Get the amount of voting power required to join this vault.
   */
  getRequiredVotingPower(): Promise<string> {
    return this.dataSource.getRequiredVotingPower();
  }

  /**
   * Get all current members of this vault.
   * @param fromBlock - The block number to start searching for members from.
   * @param toBlock - The block number to stop searching for members at.
   */
  async getMembers(fromBlock?: number, toBlock?: number): Promise<Voter[]> {
    const addresses = await this.dataSource.getMembers(fromBlock, toBlock);
    return addresses.map((address) => new Voter(address, this.context));
  }

  /**
   * Get all voters with voting power in this vault (alias for `getMembers`).
   * @param fromBlock - The block number to start searching for voters from.
   * @param toBlock - The block number to stop searching for voters at.
   */
  getVoters(fromBlock?: number, toBlock?: number): Promise<Voter[]> {
    return this.getMembers(fromBlock, toBlock);
  }

  /**
   * Get the join date of a given address.
   */
  async getJoinDate(address: string): Promise<Date | null> {
    const joinTimestamp = await this.dataSource.getJoinTimestamp(address);
    return joinTimestamp ? new Date(joinTimestamp) : null;
  }

  /**
   * Get a boolean indicating whether a given address is a current member.
   */
  async getIsMember(address: string): Promise<boolean> {
    return !!(await this.getJoinDate(address));
  }

  /**
   * Get the time (in MS) that a new GSC member must wait after joining before
   * they can vote.
   */
  getIdleDuration(): Promise<number> {
    return this.dataSource.getIdleDuration();
  }

  /**
   * Get a boolean indicating whether a member is still in the idle duration.
   * Idle members cannot vote.
   */
  async getIsIdle(address: string): Promise<boolean> {
    const joinDate = await this.getJoinDate(address);
    const isMember = !!joinDate;
    return (
      isMember &&
      joinDate.getTime() + (await this.getIdleDuration()) > Date.now()
    );
  }

  /**
   * Get the voting vaults a member joined with. Used to prove the member meets
   * the minimum voting power requirement.
   */
  getMemberVaults(address: string): Promise<string[]> {
    return this.dataSource.getMemberVaults(address);
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
    return this.dataSource.join(signer, vaults, options);
  }

  /**
   * Remove a member that's become ineligible from this GSC vault. A member
   * becomes ineligible when the voting power in the vaults they joined with
   * drops below the required minimum.
   * @param signer - The Signer of the wallet paying to kick.
   * @param member - The address of the ineligible member to kick.
   * @returns The transaction hash.
   */
  kick(
    signer: Signer,
    member: string,
    options?: TransactionOptions & {
      /**
       * The extra data the vaults need to load the member's voting power
       */
      extraVaultData?: BytesLike[];
    },
  ): Promise<string> {
    return this.dataSource.kick(signer, member, options);
  }
}
