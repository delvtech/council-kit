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

/**
 * A model of a CoreVoting contract.
 */
export class VotingContract<
  TVaults extends VotingVault[] = VotingVault[],
> extends Model {
  address: string;
  dataSource: VotingContractDataSource;
  vaults: TVaults;

  /**
   * Create a new VotingContract model instance.
   * @param address The address of the deployed contract.
   * @param vaults The VotingVault instances or addresses of the vaults that are
   *   approved for this voting contract.
   */
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
        new CoreVotingContractDataSource(address, context),
      );
  }

  /**
   * Get a proposal by id.
   */
  getProposal(id: number): Proposal {
    return new Proposal(id, this, this.context);
  }

  /**
   * Get all proposals ever created.
   * @param fromBlock Include all proposals created on or after this block number.
   * @param toBlock Include all proposals created on or before this block number.
   */
  async getProposals(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<Proposal[]> {
    const proposals = await this.dataSource.getProposals(fromBlock, toBlock);
    return proposals.map(({ id }) => new Proposal(id, this, this.context));
  }

  /**
   * Get the sum of voting power held by all voters in this voting contract.
   */
  async getTotalVotingPower(atBlock?: number): Promise<string> {
    const vaultPowers = await Promise.all(
      this.vaults.map(
        (vault) => vault.getTotalVotingPower?.(undefined, atBlock) || "0",
      ),
    );
    return sumStrings(vaultPowers);
  }

  /**
   * Get the voting power owned by a given address in this voting contract.
   */
  async getVotingPower(address: string, atBlock?: number): Promise<string> {
    const vaultPowers = await Promise.all(
      this.vaults.map((vault) => vault.getVotingPower(address, atBlock)),
    );
    return sumStrings(vaultPowers);
  }

  /**
   * Get all participants that have voting power in this voting contract.
   * @param fromBlock The block number to start searching for voters from.
   * @param toBlock The block number to stop searching for voters at.
   */
  async getVoters(): Promise<Voter[]> {
    const vaultVoters = await Promise.all(
      this.vaults.map((vault) => vault.getVoters?.() || []),
    );
    const mergedVotersList = ([] as Voter[]).concat(...vaultVoters);
    return uniqBy<Voter>(mergedVotersList, (voter) => voter.address);
  }

  /**
   * Get all casted votes on proposals in this voting contract.
   * @param fromBlock The starting block number for the range of blocks fetched.
   * @param toBlock The ending block number for the range of blocks fetched.
   */
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

  /**
   * Get the number of proposals an address has voted on and the number of
   * proposals that they were able to vote on. If the numbers are the same, then
   * the address has voted on every proposal they were able to.
   */
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
