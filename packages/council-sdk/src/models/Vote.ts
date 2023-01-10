import { CouncilContext } from "src/context";
import { Ballot } from "src/datasources/VotingContractDataSource";
import { Model, ModelOptions } from "./Model";
import { Proposal } from "./Proposal";
import { Voter } from "./Voter";

/**
 * @category Models
 */
export class Vote extends Model {
  power: string;
  ballot: Ballot;
  proposal: Proposal;
  voter: Voter;

  constructor(
    power: string,
    ballot: Ballot,
    voter: Voter,
    proposal: Proposal,
    context: CouncilContext,
    options?: ModelOptions,
  ) {
    super(context, options);
    this.power = power;
    this.ballot = ballot;
    this.proposal = proposal;
    this.voter = voter;
  }
}
