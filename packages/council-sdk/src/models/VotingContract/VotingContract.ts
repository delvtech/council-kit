import uniqBy from "lodash.uniqby";
import { CouncilContext } from "src/context";
import { sumStrings } from "src/utils/sumStrings";
import { Model } from "src/models/Model";
import { Proposal } from "src/models/Proposal";
import { Vote } from "src/models/Vote";
import { Voter } from "src/models/Voter";
import { VotingVault } from "src/models/VotingVault/VotingVault";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";

export class VotingContract extends Model {
  address: string;
  vaults: VotingVault[];

  constructor(
    address: string,
    vaults: (VotingVault | string)[],
    context: CouncilContext,
    name = "Core Voting",
  ) {
    super(context, name);
    this.address = address;
    this.vaults = vaults.map((vault) =>
      vault instanceof VotingVault
        ? vault
        : new VotingVault(vault, this.context),
    );
  }

  getProposal(id: number): Proposal {
    return new Proposal(id, this, this.context);
  }

  async getProposals(): Promise<Proposal[]> {
    // TODO: get count from data source
    const length = await Promise.resolve(10);
    return Array.from(
      { length },
      (_, i) => new Proposal(i, this, this.context),
    );
  }

  async getTotalVotingPower(atBlock?: number): Promise<string> {
    const vaultPowers = await Promise.all(
      this.vaults.map((vault) => vault.getTotalVotingPower(atBlock)),
    );
    return sumStrings(vaultPowers);
  }

  async getVotingPower(address: string, atBlock?: number): Promise<string> {
    const vaultPowers = await Promise.all(
      this.vaults.map((vault) => vault.getVotingPower(address, atBlock)),
    );
    return sumStrings(vaultPowers);
  }

  async getVoters(): Promise<Voter[]> {
    const vaultVoters = await Promise.all(
      this.vaults.map((vault) => vault.getVoters()),
    );
    const mergedVotersList = ([] as Voter[]).concat(...vaultVoters);
    return uniqBy<Voter>(mergedVotersList, (voter) => voter.address);
  }

  async getVotes(address: string): Promise<Vote[]> {
    const proposals = await this.getProposals();
    const votes = await Promise.all(
      proposals.map((proposal) => proposal.getVote(address)),
    );
    return votes.filter((vote) => BigNumber.from(vote.power).gt(0));
  }

  async getParticipation(address: string): Promise<[number, number]> {
    const votes = await this.getVotes(address);
    const votedProposalIds = votes.map((vote) => vote.proposal.id);
    const proposals = await this.getProposals();
    const missedVotePredicates = await Promise.all(
      proposals
        .filter((proposal) => !votedProposalIds.includes(proposal.id))
        .map(async (proposal) =>
          parseEther(await proposal.getVotingPower(address)).gt(0),
        ),
    );
    const missedVotesCount = missedVotePredicates.filter(Boolean).length;
    return [proposals.length - missedVotesCount, proposals.length];
  }
}
