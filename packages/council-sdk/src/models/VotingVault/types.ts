import { Voter } from "src/models/Voter";

export interface VoterWithPower {
  voter: Voter;
  votingPower: string;
}

/**
 * @category Data Sources
 */
export interface VoterPowerBreakdown extends VoterWithPower {
  /**
   * The total voting power from all wallets delegated to this voter.
   */
  votingPowerFromDelegators: string;
  /**
   * All wallets delegated to this voter with the power they're delegating.
   */
  delegators: VoterWithPower[];
}
