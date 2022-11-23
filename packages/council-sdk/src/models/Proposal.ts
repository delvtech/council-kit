import { CouncilContext } from "src/context";
import { Model } from "./Model";
import { Vote } from "./Vote";
import { VotingContract } from "./VotingContract/VotingContract";
import {
  Ballot,
  ProposalData,
  VoteResults,
} from "src/datasources/VotingContract/VotingContractDataSource";
import { Voter } from "./Voter";
import { sumStrings } from "src/utils/sumStrings";
import { Signer } from "ethers";

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
  private hash?: string;
  private requiredQuorum?: string;
  private createdBlock?: number;
  private unlockBlock?: number;
  private expirationBlock?: number;
  private lastCallBlock?: number;

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

  async getHash(): Promise<string | null> {
    const data = await this.getData();
    return data?.hash || null;
  }

  async getRequiredQuorum(): Promise<string | null> {
    const data = await this.getData();
    return data?.requiredQuorum || null;
  }

  async getCreatedBlock(): Promise<number | null> {
    const data = await this.getData();
    return data?.createdBlock || null;
  }

  async getUnlockBlock(): Promise<number | null> {
    const data = await this.getData();
    return data?.unlockBlock || null;
  }

  async getExpirationBlock(): Promise<number | null> {
    const data = await this.getData();
    return data?.expirationBlock || null;
  }

  async getLastCallBlock(): Promise<number | null> {
    const data = await this.getData();
    return data?.lastCallBlock || null;
  }

  /**
   * Proposals are active during their voting period, i.e., from creation block
   * up to expiration block or execution. This will be false if the current
   * block is later than the proposal's expiration or the proposal has been
   * executed.
   */
  async getIsActive(): Promise<boolean> {
    const expirationBlock = await this.getExpirationBlock();
    if (!expirationBlock) {
      return false;
    }
    const latestBlock = await this.context.provider.getBlockNumber();
    return expirationBlock > latestBlock && !(await this.getIsExecuted());
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
    const createdBlock = await this.getCreatedBlock();
    if (!createdBlock) {
      return null;
    }
    return this.votingContract.getVotingPower(address, createdBlock);
  }

  getResults(): Promise<VoteResults> {
    return this.votingContract.dataSource.getResults(this.id);
  }

  async getCurrentQuorum(): Promise<string> {
    const results = await this.getResults();
    return sumStrings(Object.values(results));
  }

  async getIsExecutable(): Promise<boolean> {
    const unlockBlock = await this.getUnlockBlock();
    const requiredQuorum = await this.getRequiredQuorum();
    if (!unlockBlock || !requiredQuorum) {
      return false;
    }
    const latestBlock = await this.context.provider.getBlockNumber();
    return (
      latestBlock >= unlockBlock &&
      (await this.getCurrentQuorum()) >= requiredQuorum
    );
  }

  vote(signer: Signer, ballot: Ballot): Promise<string> {
    return this.votingContract.dataSource.vote(
      signer,
      this.votingContract.vaults.map(({ address }) => address),
      this.id,
      ballot,
    );
  }
}
