import { IVotingVault } from "@delvtech/council-artifacts/IVotingVault";
import { Address } from "@delvtech/drift";

export type VotingVaultAbi = typeof IVotingVault.abi;

export type VotingPowerByVoter = {
  [voter: Address]: bigint;
};

export interface VoterWithPower {
  voter: Address;
  votingPower: bigint;
}

export interface VoterPowerBreakdown extends VoterWithPower {
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
