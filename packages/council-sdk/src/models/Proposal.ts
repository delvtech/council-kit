import { CouncilContext } from "src/context";
import { Model } from "./Model";
import { Vote } from "./Vote";
import { VotingContract } from "./VotingContract/VotingContract";
import { formatEther, parseEther } from "ethers/lib/utils";
import {
  ProposalData,
  VoteResults,
} from "src/datasources/VotingContract/VotingContractDataSource";
import { Voter } from "./Voter";

export interface ProposalOptions {
  hash?: string;
  requiredQuorum?: string;
  createdBlock?: number;
  unlockBlock?: number;
  expirationBlock?: number;
  lastCallBlock?: number;
  name?: string;
}

export class Proposal extends Model {
  id: number;
  votingContract: VotingContract;
  hash?: string;
  requiredQuorum?: string;
  createdBlock?: number;
  unlockBlock?: number;
  expirationBlock?: number;
  lastCallBlock?: number;

  constructor(
    id: number,
    votingContract: VotingContract | string,
    context: CouncilContext,
    options?: ProposalOptions,
  ) {
    super(context, options?.name ?? `Proposal ${id}`);
    this.id = id;
    this.votingContract =
      votingContract instanceof VotingContract
        ? votingContract
        : new VotingContract(votingContract, [], context);
    this.hash = options?.hash;
    this.requiredQuorum = options?.requiredQuorum;
    this.createdBlock = options?.createdBlock;
    this.unlockBlock = options?.unlockBlock;
    this.expirationBlock = options?.expirationBlock;
    this.lastCallBlock = options?.lastCallBlock;
  }

  async getData(): Promise<Partial<ProposalData>> {
    const data = await this.votingContract.dataSource.getProposal(this.id);
    if (data) {
      return data;
    }
    // does this already have all data to at least return a ProposalDataPreview?
    if (this.createdBlock && this.unlockBlock && this.expirationBlock) {
      return {
        id: this.id,
        hash: this.hash,
        requiredQuorum: this.requiredQuorum,
        createdBlock: this.createdBlock,
        unlockBlock: this.unlockBlock,
        expirationBlock: this.expirationBlock,
        lastCallBlock: this.lastCallBlock,
      };
    }
    const allDataPreviews = await this.votingContract.getProposals();
    const dataPreview = allDataPreviews.find(({ id }) => id === this.id);
    return {
      id: this.id,
      hash: this.hash,
      requiredQuorum: this.requiredQuorum,
      createdBlock: this.createdBlock || dataPreview?.createdBlock,
      unlockBlock: this.unlockBlock || dataPreview?.unlockBlock,
      expirationBlock: this.expirationBlock || dataPreview?.expirationBlock,
      lastCallBlock: this.lastCallBlock || dataPreview?.lastCallBlock,
    };
  }

  /**
   * Proposals are active during their voting period, i.e., from creation block
   * up to expiration block or execution. This will be false if the current
   * block is later than the proposal's expiration or the proposal has been
   * executed.
   */
  async getIsActive(): Promise<boolean> {
    const data = await this.getData();
    if (!data?.expirationBlock) {
      return false;
    }
    const latestBlock = await this.context.provider.getBlockNumber();
    return data.expirationBlock > latestBlock && !(await this.getIsExecuted());
  }

  async getIsExecuted(atBlock?: number): Promise<boolean> {
    const deletedIds =
      await this.votingContract.dataSource.getExecutedProposalIds(
        undefined,
        atBlock ?? (await this.context.provider.getBlockNumber()),
      );
    return deletedIds.includes(this.id);
  }

  async getVote(address: string): Promise<Vote> {
    const { ballot, power } = await this.votingContract.dataSource.getVote(
      address,
      this.id,
    );
    return new Vote(
      power,
      ballot,
      new Voter(address, this.context),
      this,
      this.context,
    );
  }

  async getVotes(fromBlock?: number, toBlock?: number): Promise<Vote[]> {
    return this.votingContract.getVotes(
      undefined,
      this.id,
      fromBlock,
      toBlock ?? (await this.context.provider.getBlockNumber()),
    );
  }

  async getVotingPower(address: string): Promise<string | null> {
    const data = await this.getData();
    if (!data) {
      return null;
    }
    return this.votingContract.getVotingPower(address, data.createdBlock);
  }

  getResults(): Promise<VoteResults> {
    return this.votingContract.dataSource.getResults(this.id);
  }

  async getCurrentQuorum(): Promise<string> {
    const results = await this.getResults();
    const totalPowerVoted = parseEther("0");
    for (const power of Object.values(results)) {
      totalPowerVoted.add(parseEther(power));
    }
    return formatEther(totalPowerVoted);
  }

  async getIsExecutable(): Promise<boolean> {
    const data = await this.getData();
    if (!data?.unlockBlock || !data?.requiredQuorum) {
      return false;
    }
    const latestBlock = await this.context.provider.getBlockNumber();
    return (
      latestBlock >= data.unlockBlock &&
      (await this.getCurrentQuorum()) >= data.requiredQuorum
    );
  }
}
