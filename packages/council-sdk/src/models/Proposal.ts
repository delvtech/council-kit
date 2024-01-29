import { BytesLike, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import {
  Actions,
  Ballot,
  VoteResults,
} from "src/datasources/votingContract/VotingContractDataSource";
import { ReadVoter } from "src/models/Voter";
import { getVaultsWithPower } from "src/utils/getVaultsWithPower";
import { sumStrings } from "src/utils/sumStrings";
import { ReadCoreVoting } from "./CoreVoting/CoreVoting";
import { Model, ReadModelOptions } from "./Model";

export interface ReadProposalOptions extends ReadModelOptions {
  id: bigint;
  coreVoting: ReadCoreVoting | `0x${string}`;
  /**
   * The block number of when this proposal was created.
   */
  created: bigint;
  expiration: bigint;
  lastCall?: bigint;
  proposalHash?: `0x${string}`;
  requiredQuorum?: bigint;
  unlock?: bigint;
}

/**
 * A model of a Proposal in Council
 * @category Models
 */
export class ReadProposal extends Model {
  id: bigint;
  coreVoting: ReadCoreVoting;
  created: bigint;
  expiration: bigint;

  private _lastCall?: bigint;
  private _proposalHash?: `0x${string}`;
  private _requiredQuorum?: bigint;
  private _unlock?: bigint;
  private _allDataFetched = false;

  /**
   * Create a new Proposal model instance.
   * @param id - The id of the proposal in the voting contract.
   * @param votingContract - the voting contract in which this proposal was
   *   created.
   */
  constructor({
    id,
    coreVoting,
    contractFactory,
    network,
    created,
    expiration,
    lastCall,
    name,
    proposalHash,
    requiredQuorum,
    unlock,
  }: ReadProposalOptions) {
    super({ contractFactory, network, name });
    this.id = id;
    this.coreVoting =
      typeof coreVoting === "string"
        ? new ReadCoreVoting({
            address: coreVoting,
            contractFactory,
            network,
          })
        : coreVoting;
    this.created = created;
    this.expiration = expiration;
    this._lastCall = lastCall;
    this._proposalHash = proposalHash;
    this._requiredQuorum = requiredQuorum;
    this._unlock = unlock;
  }

  /**
   * Get the array of addresses that will be called (targets) and the data
   * they'll be called with (calldatas) by a proposal.
   */
  getTargetsAndCalldatas(): Promise<Actions | null> {
    const createdEvent = await this.coreVoting.get;
  }

  /**
   * Idempotent function to ensure all possible data is fetched for the
   * proposal. (From both events and the CoreVoting contract)
   **/
  private async _getProposalData(): Promise<
    | {
        _lastCall?: bigint;
        _proposalHash?: `0x${string}`;
        _requiredQuorum?: bigint;
        _unlock?: bigint;
      }
    | undefined
  > {
    if (this._allDataFetched) {
      return {
        _lastCall: this._lastCall,
        _proposalHash: this._proposalHash,
        _requiredQuorum: this._requiredQuorum,
        _unlock: this._unlock,
      };
    }

    const { _lastCall, _proposalHash, _requiredQuorum, _unlock } =
      (await this.coreVoting.getProposal({ id: this.id }))!;

    const data = { _lastCall, _proposalHash, _requiredQuorum, _unlock };
    Object.assign(this, data, { _allDataFetched: true });
    return data;
  }

  /**
   * Get the hash of this proposal, used by its voting contract to verify the
   * proposal data on execution. Not available on executed proposals.
   */
  async getHash(): Promise<`0x${string}` | undefined> {
    const { _proposalHash } = (await this._getProposalData()) || {};
    return _proposalHash;
  }

  /**
   * Get the required quorum for this proposal to be executed. If the sum of
   * voting power from all casted votes does not meet or exceed this number,
   * then the proposal is not passing quorum. Not available on executed
   * proposals.
   */
  async getRequiredQuorum(): Promise<string | null> {
    const { _proposalHash } = (await this._getProposalData()) || {};
    return data?.requiredQuorum || null;
  }

  /**
   * Get the block number of when this proposal can be executed. Will only be
   * null if this proposal instance was initiated with an invalid id.
   */
  async getUnlockBlock(): Promise<number | null> {
    const data = await this.getData();
    return data?.unlockBlock || null;
  }

  async getCreatedBy(): Promise<string | null> {
    return this.votingContract.dataSource.getProposalCreatedBy(this.id);
  }

  /**
   * Get the hash of the transaction that created the proposal, or null if
   * the Proposal doesn't exist.
   * @returns The transaction hash
   */
  getCreatedTransactionHash(): Promise<string | null> {
    return this.votingContract.dataSource.getProposalCreatedTransactionHash(
      this.id,
    );
  }

  /**
   * Get the block number of when this voting ends for this proposal. Will only
   * be null if this proposal instance was initiated with an invalid id.
   */
  async getExpirationBlock(): Promise<number | null> {
    const data = await this.getData();
    return data?.expirationBlock || null;
  }

  /**
   * Get the block number after which this proposal can no longer be executed.
   * Not available on executed proposals.
   */
  async getLastCallBlock(): Promise<number | null> {
    const data = await this.getData();
    return data?.lastCallBlock || null;
  }

  /**
   * Get a boolean indicating whether this proposal is still active. Proposals
   * are active during their voting period, i.e., from creation block up to
   * expiration block or execution. Returns false if the current block is later
   * than this proposal's expiration or this proposal has been executed.
   */
  async getIsActive(): Promise<boolean> {
    const expirationBlock = await this.getExpirationBlock();
    if (!expirationBlock) {
      return false;
    }
    const latestBlock = await this.context.provider.getBlockNumber();
    return expirationBlock > latestBlock && !(await this.getIsExecuted());
  }

  /**
   * Get a boolean indicating whether this proposal has been executed.
   * @param atBlock - The block number to check. If this proposal was executed
   *   on or before this block, this will return true.
   */
  async getIsExecuted(atBlock?: number): Promise<boolean> {
    const deletedIds =
      await this.votingContract.dataSource.getExecutedProposalIds(
        undefined,
        atBlock,
      );
    return deletedIds.includes(this.id);
  }

  /**
   * Get the hash of the transaction that executed the proposal, or null if
   * the Proposal wasn't executed.
   * @returns The transaction hash
   */
  getExecutedTransactionHash(): Promise<string | null> {
    return this.votingContract.dataSource.getProposalExecutedTransactionHash(
      this.id,
    );
  }

  /**
   * Get the casted vote for a given address on this proposal.
   * @param address - The address that casted the vote.
   */
  async getVote(address: string): Promise<Vote | null> {
    const vote = await this.votingContract.dataSource.getVote(address, this.id);
    return (
      vote &&
      new Vote(
        vote.power,
        vote.ballot,
        new Voter(address, this.context),
        this,
        this.context,
      )
    );
  }

  /**
   * Get all casted votes on this proposal
   * @param fromBlock - Include all votes casted on or after this block number.
   * @param toBlock - Include all votes casted on or before this block number.
   */
  async getVotes(fromBlock?: number, toBlock?: number): Promise<Vote[]> {
    return this.votingContract.getVotes(undefined, this.id, fromBlock, toBlock);
  }

  /**
   * Get the usable voting power of a given address for this proposal determined
   * by its creation block. Any changes to voting power after the creation block
   * of this proposal does not apply to this proposal and therefore will not be
   * reflected.
   * @param extraData - ABI encoded optional extra data used by some vaults, such
   *   as merkle proofs.
   */
  async getVotingPower({
    voter,
    extraData,
  }: {
    voter: ReadVoter | `0x${string}`;
    extraData?: `0x${string}`[];
  }): Promise<bigint> {
    return this.coreVoting.getVotingPower({
      voter,
      atBlock: this.created,
      extraData,
    });
  }

  /**
   * Get the total voting power of all votes on this proposal by their ballot.
   */
  getResults(): Promise<VoteResults> {
    return this.votingContract.dataSource.getResults(this.id);
  }

  /**
   * Get the current quorum of this proposal measured by summing the voting
   * power of all casted votes.
   */
  async getCurrentQuorum(): Promise<string> {
    const results = await this.getResults();
    return sumStrings(Object.values(results));
  }

  /**
   * Get a boolean indicating whether this proposal can be executed. Proposals
   * can only be executed if the quorum requirement has been met, there are more
   * yes votes than no votes, and the current block is between the unlock and
   * last call blocks.
   */
  async getIsExecutable(): Promise<boolean> {
    const unlockBlock = await this.getUnlockBlock();
    const lastCallBlock = await this.getLastCallBlock();
    const requiredQuorum = await this.getRequiredQuorum();
    if (!unlockBlock || !requiredQuorum || !lastCallBlock) {
      return false;
    }

    const latestBlock = await this.context.provider.getBlockNumber();
    if (latestBlock < unlockBlock || latestBlock > lastCallBlock) {
      return false;
    }

    const currentQuorum = await this.getCurrentQuorum();
    const results = await this.getResults();
    return (
      parseEther(currentQuorum).gte(parseEther(requiredQuorum)) &&
      parseEther(results.yes).gt(parseEther(results.no))
    );
  }

  /**
   * Execute a proposal.
   * @param signer - An ethers Signer instance.
   * @returns The transaction hash.
   */
  execute(signer: Signer, options?: TransactionOptions): Promise<string> {
    return this.votingContract.dataSource.executeProposal(
      signer,
      this.id,
      options,
    );
  }

  /**
   * Vote on this proposal.
   * @param signer - An ethers Signer instance for the voter.
   * @param ballot - The ballot to cast.
   * @returns The transaction hash.
   */
  async vote(
    signer: Signer,
    ballot: Ballot,
    options?: TransactionOptions & {
      /**
       * Extra data given to the vaults to help calculation.
       */
      extraVaultData?: BytesLike[];
    },
  ): Promise<string> {
    const vaults = await getVaultsWithPower(
      await signer.getAddress(),
      this.votingContract.vaults,
    );
    return this.votingContract.dataSource.vote(
      signer,
      vaults.map(({ address }) => address),
      this.id,
      ballot,
      options,
    );
  }
}
