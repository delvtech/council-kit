import { CouncilContext } from "src/context";
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
   * @param gscVault The GSCVault instance or address for the approved GSC vault.
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
   * Get the amount of voting power required to join this GSC vault.
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
   * Get a boolean indicating whether an address is eligible to join become a
   * member of this vault.
   */
  getIsEligible(address: string): Promise<boolean> {
    return this.vaults[0].getIsEligible(address);
  }
}
