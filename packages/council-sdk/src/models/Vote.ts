import { CouncilContext } from "src/context";
import { Model } from "./Model";
import { Proposal } from "./Proposal";

export type Ballot = "yes" | "no" | "maybe";

export class Vote extends Model {
  power: string;
  ballot: Ballot;
  proposal: Proposal;

  constructor(
    power: string,
    ballot: Ballot,
    proposal: Proposal,
    context: CouncilContext,
  ) {
    super(context);
    this.power = power;
    this.ballot = ballot;
    this.proposal = proposal;
  }
}
