import { Address, Bytes, Hash } from "@delvtech/drift";
import { BALLOTS } from "src/entities/coreVoting/constants";

/**
 * A valid ballot option.
 */
export type Ballot = (typeof BALLOTS)[number];

/**
 * The amount of voting power casted by ballot.
 */
export type VoteResults = Record<Ballot, bigint>;

/**
 * The actions a proposal will perform.
 */
export interface Actions {
  targets: Address[];
  calldatas: Bytes[];
}

export interface ProposalArgs {
  proposalId: bigint;
  createdBlock: bigint;
  /**
   * The block number after which the proposal can be executed.
   */
  unlockBlock: bigint;
  /**
   * The block number after which the proposal can no longer be voted on.
   */
  expirationBlock: bigint;
}

export interface Proposal extends ProposalArgs {
  proposalHash: Hash;
  requiredQuorum: bigint;
  /**
   * The block number after which the proposal can no longer be executed.
   */
  lastCallBlock: bigint;
}

export interface Vote {
  proposalId: bigint;
  ballot: Ballot;
  votingPower: bigint;
  voter: Address;
}
