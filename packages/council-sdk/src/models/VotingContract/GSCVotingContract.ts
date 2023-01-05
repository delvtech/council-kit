import { BytesLike, Signer } from "ethers";
import { CouncilContext } from "src/context";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { Voter } from "src/models/Voter";
import { GSCVault } from "src/models/VotingVault/GSCVault";
import { VotingContract, VotingContractOptions } from "./VotingContract";

/**
 * A model of a CoreVoting contract intended to be used by the Governance
 * Steering Council.
 */
export class GSCVotingContract extends VotingContract<[GSCVault]> {
  /**
   * Create a new iGSCVotingContract model instance.
   * @param address The address of the deployed contract.
   * @param gscVault The GSCVault instance or address of the approved GSC vault.
   */
  constructor(
    address: string,
    gscVault: GSCVault | string,
    context: CouncilContext,
    options?: VotingContractOptions,
  ) {
    super(
      address,
      [
        gscVault instanceof GSCVault
          ? gscVault
          : new GSCVault(gscVault, context),
      ],
      context,
      {
        ...options,
        name: options?.name ?? "GSC Voting",
      },
    );
  }

  /**
   * Get all participants that have voting power in this voting contract.
   * @param fromBlock The block number to start searching for voters from.
   * @param toBlock The block number to stop searching for voters at.
   */
  getVoters(fromBlock?: number, toBlock?: number): Promise<Voter[]> {
    return this.vaults[0].getVoters(fromBlock, toBlock);
  }

  /**
   * Get the amount of voting power required to join this voting contract.
   */
  getRequiredVotingPower(): Promise<string> {
    return this.vaults[0].getRequiredVotingPower();
  }

  /**
   * Get the join date of a given member.
   */
  getJoinDate(address: string): Promise<Date | null> {
    return this.vaults[0].getJoinDate(address);
  }

  /**
   * Get a boolean indicating whether a given address is a current member.
   */
  getIsMember(address: string): Promise<boolean> {
    return this.vaults[0].getIsMember(address);
  }

  /**
   * Get the time (in MS) that a new GSC member must wait after joining before
   * they can vote.
   */
  getIdleDuration(): Promise<number> {
    return this.vaults[0].getIdleDuration();
  }

  /**
   * Get a boolean indicating whether a member is still in the idle duration.
   * Idle members cannot vote.
   */
  getIsIdle(address: string): Promise<boolean> {
    return this.vaults[0].getIsIdle(address);
  }

  /**
   * Get the voting vaults a member joined with. Used to prove the member meets
   * the minimum voting power requirement.
   */
  getMemberVaults(address: string): Promise<string[]> {
    return this.vaults[0].getMemberVaults(address);
  }

  /**
   * Become a member of this GSC voting contract.
   * @param signer The Signer of the joining member.
   * @param vaults The addresses of the approved vaults the joining member has
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
    return this.vaults[0].join(signer, vaults, options);
  }

  /**
   * Remove a member that's become ineligible from this GSC vault. A member
   * becomes ineligible when the voting power in the vaults they joined with
   * drops below the required minimum.
   * @param signer The Signer of the wallet paying to kick.
   * @param member The address of the ineligible member to kick.
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
    return this.vaults[0].kick(signer, member, options);
  }
}
