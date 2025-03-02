import { Address } from "@delvtech/drift";

export type VotingPowerByVoter = {
  [voter: Address]: bigint;
};

export interface VoterWithPower {
  voter: Address;
  votingPower: bigint;
}

export interface VotingPowerBreakdown extends VoterWithPower {
  /**
   * The total voting power from all wallets delegated to this voter. Does not
   * include self-delegation.
   */
  votingPowerFromDelegators: bigint;
  /**
   * All wallets delegated to this voter with the power they're delegating.
   *
   * **Note:** Does not include self-delegation.
   */
  delegators: VoterWithPower[];
}
