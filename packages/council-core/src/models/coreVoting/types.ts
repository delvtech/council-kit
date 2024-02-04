import { CoreVoting } from "@council/artifacts/dist/CoreVoting";
import { BALLOTS } from "src/models/coreVoting/constants";

export type CoreVotingAbi = typeof CoreVoting.abi;

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
