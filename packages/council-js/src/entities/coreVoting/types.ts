import { Address, Bytes, Eval, Hash, OneOf, Replace } from "@delvtech/drift";
import {
  BALLOTS,
  EXECUTED_PROPOSAL_HASH,
} from "src/entities/coreVoting/constants";

/**
 * The status of a proposal.
 *
 * - `active`: Still open for voting.
 * - `executed`: Executed successfully.
 * - `failed`: Expired before meeting requirements for execution.
 * - `expired`: Met requirements for execution but wasn't executed in time.
 * - `unknown`: No information is available. Possibly non-existent.
 */
export type ProposalStatus =
  | "active"
  | "executed"
  | "failed"
  | "expired"
  | "unknown";

/**
 * The data emitted by the `ProposalCreated` event.
 */
export type ProposalEventArgs = {
  coreVoting: Address;
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
};

/**
 * A proposal creation event.
 */
export type ProposalCreation = ProposalEventArgs & {
  blockNumber: bigint;
  transactionHash: Hash;
};

/**
 * A proposal with it's current state.
 */
export type ProposalWithState = ProposalEventArgs & {
  proposalHash: Hash;
  /**
   * The amount of voting power required to pass the proposal.
   */
  requiredQuorum: bigint;
  /**
   * The block number after which the proposal can no longer be executed.
   */
  lastCallBlock: bigint;
  status?: "active" | "expired" | "failed";
};

/**
 * An executed proposal that has been deleted from the contract.
 */
export type ExecutedProposal = Replace<
  ProposalEventArgs,
  {
    proposalId: bigint;
    proposalHash: typeof EXECUTED_PROPOSAL_HASH;
    status: "executed";
  }
>;

/**
 * An unknown proposal that has no information available.
 */
export type UnknownProposal = {
  coreVoting: Address;
  proposalId: bigint;
  proposalHash: typeof EXECUTED_PROPOSAL_HASH;
  status: "unknown";
};

/**
 * A proposal in any state.
 *
 * Once a proposal has been executed, it will be deleted from the voting
 * contract and only the event logs will remain.
 */
export type Proposal = OneOf<
  ProposalWithState | ExecutedProposal | UnknownProposal
>;

/**
 * A valid ballot option.
 */
export type Ballot = (typeof BALLOTS)[number];

/**
 * The amount of voting power casted for each ballot.
 */
export type VoteResults = Eval<
  Record<Ballot, bigint> & {
    total: bigint;
  }
>;

/**
 * A vote on a proposal.
 */
export type Vote = {
  proposalId: bigint;
  ballot: Ballot;
  votingPower: bigint;
  voter: Address;
};

/**
 * The actions a proposal will perform.
 */
export type Actions = {
  targets: Address[];
  calldatas: Bytes[];
};
