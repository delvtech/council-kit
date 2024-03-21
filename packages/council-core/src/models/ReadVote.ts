import { Ballot } from "src/models/coreVoting/types";
import { Model, ReadModelOptions } from "src/models/Model";
import { ReadProposal } from "src/models/proposal/ReadProposal";
import { ReadVoter } from "src/models/ReadVoter";

export interface ReadVoteOptions extends ReadModelOptions {
  ballot: Ballot;
  power: bigint;
  proposal: ReadProposal;
  voter: ReadVoter | `0x${string}`;
}

/**
 * @category Models
 */
export class ReadVote extends Model {
  ballot: Ballot;
  power: bigint;
  proposal: ReadProposal;
  voter: ReadVoter;

  constructor({
    name = "Vote",
    ballot,
    contractFactory,
    network,
    power,
    proposal,
    voter,
  }: ReadVoteOptions) {
    super({ contractFactory, network, name });
    this.ballot = ballot;
    this.power = power;
    this.proposal = proposal;
    this.voter =
      typeof voter === "string"
        ? new ReadVoter({
            address: voter,
            contractFactory,
            network,
          })
        : voter;
  }
}
