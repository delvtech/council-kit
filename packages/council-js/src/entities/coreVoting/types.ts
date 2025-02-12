import { BALLOTS } from "src/entities/coreVoting/constants";

/**
 * A valid ballot option.
 * @category Data Sources
 */
export type Ballot = (typeof BALLOTS)[number];

/**
 * The amount of voting power casted by ballot.
 * @category Data Sources
 */
export type VoteResults = Record<Ballot, bigint>;

/**
 * The actions a proposal will perform.
 */
export interface Actions {
  targets: `0x${string}`[] | readonly `0x${string}`[];
  calldatas: `0x${string}`[] | readonly `0x${string}`[];
}

export interface ProposalArgs {
  proposalId: bigint;
  createdBlock: bigint;
  unlockBlock: bigint;
  expirationBlock: bigint;
}

export interface Proposal extends ProposalArgs {
  proposalHash: `0x${string}`;
  requiredQuorum: bigint;
  lastCallBlock: bigint;
}

export interface Vote {
  proposalId: bigint;
  ballot: Ballot;
  votingPower: bigint;
  voter: `0x${string}`;
}
