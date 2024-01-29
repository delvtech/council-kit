import { Ballot } from "src/datasources/votingContract/VotingContractDataSource";
import { Model, ReadModelOptions } from "src/models/Model";
import { ReadProposal } from "src/models/Proposal";
import { ReadVoter } from "src/models/Voter";

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
    ballot,
    contractFactory,
    network,
    power,
    proposal,
    voter,
    name,
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
