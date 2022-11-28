import uniqBy from "lodash.uniqby";
import { CouncilContext } from "src/context";
import { sumStrings } from "src/utils/sumStrings";
import { Model } from "src/models/Model";
import { Proposal } from "src/models/Proposal";
import { Vote } from "src/models/Vote";
import { Voter } from "src/models/Voter";
import { VotingVault } from "src/models/VotingVault/VotingVault";
import { parseEther } from "ethers/lib/utils";
import { VotingContractDataSource } from "src/datasources/VotingContract/VotingContractDataSource";
import { CoreVotingContractDataSource } from "src/datasources/VotingContract/CoreVotingContractDataSource";

export interface VotingContractOptions {
  name?: string;
  dataSource?: VotingContractDataSource;
}

export class VotingContract<
  TVaults extends VotingVault[] = VotingVault[],
> extends Model {
  address: string;
  dataSource: VotingContractDataSource;
  vaults: TVaults;

  constructor(
    address: string,
    vaults: (VotingVault | string)[],
    context: CouncilContext,
    options?: VotingContractOptions,
  ) {
    super(context, options?.name ?? "Core Voting");
    this.address = address;
    this.vaults = vaults.map((vault) =>
      vault instanceof VotingVault
        ? vault
        : new VotingVault(vault, this.context),
    ) as TVaults;
    this.dataSource =
      options?.dataSource ||
      this.context.registerDataSource(
        { address },
        new CoreVotingContractDataSource(address, context.provider),
      );
  }

  getProposal(id: number): Proposal {
    return new Proposal(id, this, this.context);
  }

  async getProposals(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<Proposal[]> {
    const proposals = await this.dataSource.getProposals(fromBlock, toBlock);

    return proposals.map(
      ({ id, createdBlock, unlockBlock, expirationBlock }) =>
        new Proposal(id, this, this.context, {
          createdBlock,
          unlockBlock,
          expirationBlock,
        }),
    );
  }

  async getTotalVotingPower(atBlock?: number): Promise<string> {
    const vaultPowers = await Promise.all(
      this.vaults.map(
        (vault) => vault.getTotalVotingPower?.(undefined, atBlock) || "0",
      ),
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
      this.vaults.map((vault) => vault.getVoters?.() || []),
    );
    const mergedVotersList = ([] as Voter[]).concat(...vaultVoters);
    return uniqBy<Voter>(mergedVotersList, (voter) => voter.address);
  }

  async getVotes(
    address?: string,
    proposalId?: number,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<Vote[]> {
    const votes = await this.dataSource.getVotes(
      address,
      proposalId,
      fromBlock,
      toBlock ?? (await this.context.provider.getBlockNumber()),
    );
    return votes.map(
      ({ address, proposalId, power, ballot }) =>
        new Vote(
          power,
          ballot,
          new Voter(address, this.context),
          new Proposal(proposalId, this, this.context),
          this.context,
        ),
    );
  }

  async getParticipation(address: string): Promise<[number, number]> {
    const votes = await this.getVotes(address);
    const votedProposalIds = votes.map((vote) => vote.proposal.id);
    const proposals = await this.getProposals();
    const proposalsNotVoted = await Promise.all(
      proposals
        .filter((proposal) => !votedProposalIds.includes(proposal.id))
        .map(async (proposal) =>
          // could be null if the proposal has been deleted and the created
          // block can't be fetched.
          parseEther((await proposal.getVotingPower(address)) || "0").gt(0),
        ),
    );
    const missedVotesCount = proposalsNotVoted.filter(Boolean).length;
    return [proposals.length - missedVotesCount, proposals.length];
  }
}
