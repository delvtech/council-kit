import { Voter } from "src/models/Voter";

export interface VoterWithPower {
  voter: Voter;
  votingPower: string;
}

export interface VoterPowerBreakdown extends VoterWithPower {
  /**
   * The total voting power from all wallets delegated to this voter. Does not
   * include self-delegation.
   */
  votingPowerFromDelegators: string;
  /**
   * All wallets delegated to this voter with the power they're delegating. Does
   * not include self-delegation.
   */
  delegators: VoterWithPower[];
}
