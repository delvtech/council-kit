import { CouncilContext } from "src/context";
import { Ballot } from "src/datasources/VotingContract/VotingContractDataSource";
import { Model } from "./Model";
import { Proposal } from "./Proposal";
import { Voter } from "./Voter";

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
  ) {
    super(context);
    this.power = power;
    this.ballot = ballot;
    this.proposal = proposal;
    this.voter = voter;
  }
}
