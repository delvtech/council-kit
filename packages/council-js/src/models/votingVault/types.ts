import { IVotingVault } from "@delvtech/council-artifacts/IVotingVault";
import { ReadVoter } from "src/models/ReadVoter";

export type VotingVaultAbi = typeof IVotingVault.abi;

export interface VoterWithPower {
  voter: ReadVoter;
  votingPower: bigint;
}

export interface VoterPowerBreakdown extends VoterWithPower {
  /**
   * The total voting power from all wallets delegated to this voter. Does not
   * include self-delegation.
   */
  votingPowerFromAllDelegators: bigint;
  /**
   * All wallets delegated to this voter with the power they're delegating. Does
   * not include self-delegation.
   */
  votingPowerByDelegator: VoterWithPower[];
}
