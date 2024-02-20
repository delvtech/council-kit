import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { ContractReadOptions, Event, Transaction } from "@delvtech/evm-client";
import { Model, ReadModelOptions } from "src/models/Model";
import { ReadVote } from "src/models/ReadVote";
import { ReadVoter } from "src/models/ReadVoter";
import { ReadCoreVoting } from "src/models/coreVoting/ReadCoreVoting";
import { Actions, Ballot, VoteResults } from "src/models/coreVoting/types";
import { BlockLike } from "src/utils/blockToReadOptions";

export interface BaseProposalOptions {
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

export interface ReadProposalOptions
  extends BaseProposalOptions,
    ReadModelOptions {}

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
      coreVoting instanceof ReadCoreVoting
        ? coreVoting
        : new ReadCoreVoting({
            address: coreVoting,
            contractFactory,
            network,
          });
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
  async getTargetsAndCalldatas(): Promise<Actions | undefined> {
    const createdTransaction = await this.getCreatedTransaction();
    if (createdTransaction) {
      const {
        args: { targets, calldatas },
      } = this.coreVoting.contract.decodeFunctionData<"proposal">(
        createdTransaction.input,
      );
      return {
        targets,
        calldatas,
      };
    }
  }

  /**
   * Get the hash of this proposal, used by its voting contract to verify the
   * proposal data on execution. Not available on executed proposals.
   */
  async getHash(): Promise<`0x${string}` | undefined> {
    const data = await this._getData();
    return data?._proposalHash;
  }

  /**
   * Get the required quorum for this proposal to be executed. If the sum of
   * voting power from all casted votes does not meet or exceed this number,
   * then the proposal is not passing quorum. Not available on executed
   * proposals.
   */
  async getRequiredQuorum(): Promise<bigint | undefined> {
    const data = await this._getData();
    return data?._requiredQuorum;
  }

  /**
   * Get the block number of when this proposal can be executed. Will only be
   * null if this proposal instance was initiated with an invalid id.
   */
  async getUnlockBlock(): Promise<bigint | undefined> {
    const data = await this._getData();
    return data?._unlock;
  }

  async getCreatedBy(): Promise<ReadVoter | undefined> {
    const createdTransaction = await this.getCreatedTransaction();
    return (
      createdTransaction?.from &&
      new ReadVoter({
        address: createdTransaction.from,
        contractFactory: this.contractFactory,
        network: this.network,
      })
    );
  }

  /**
   * Get the hash of the transaction that created the proposal, or null if
   * the Proposal doesn't exist.
   * @returns The transaction hash
   */
  async getCreatedTransaction(): Promise<Transaction | undefined> {
    const createdEvent = await this._getCreatedEvent();
    const transaction =
      createdEvent?.transactionHash &&
      (await this.network.getTransaction(createdEvent?.transactionHash));
    return transaction;
  }

  /**
   * Get the block number after which this proposal can no longer be executed.
   * Not available on executed proposals.
   */
  async getLastCallBlock(): Promise<bigint | undefined> {
    const data = await this._getData();
    return data?._lastCall;
  }

  /**
   * Get a boolean indicating whether this proposal is still active. Proposals
   * are active during their voting period, i.e., from creation block up to
   * expiration block or execution. Returns false if the current block is later
   * than this proposal's expiration or this proposal has been executed.
   */
  async getIsActive(): Promise<boolean> {
    const isExecuted = await this.getIsExecuted();
    if (isExecuted) {
      return false;
    }
    const block = await this.network.getBlock();

    return this.expiration > (block?.blockNumber ?? Infinity);
  }

  /**
   * Get a boolean indicating whether this proposal has been executed.
   * @param atBlock - The block number to check. If this proposal was executed
   *   on or before this block, this will return true.
   */
  async getIsExecuted(): Promise<boolean> {
    const executedEvent = await this._getExecutedEvent();
    return !!executedEvent;
  }

  /**
   * Get the hash of the transaction that executed the proposal, or null if
   * the Proposal wasn't executed.
   * @returns The transaction hash
   */
  async getExecutedTransaction(): Promise<Transaction | undefined> {
    const executedEvent = await this._getExecutedEvent();
    const hash = executedEvent?.transactionHash;
    const transaction = hash && (await this.network.getTransaction(hash));
    return transaction;
  }

  /**
   * Get the casted vote for a given address on this proposal.
   * @param address - The address that casted the vote.
   */
  async getVote({
    account,
  }: {
    account: ReadVoter | `0x${string}`;
  }): Promise<ReadVote | undefined> {
    return this.coreVoting.getVote({
      proposalId: this.id,
      account,
    });
  }

  /**
   * Get all casted votes on this proposal
   * @param fromBlock - Include all votes casted on or after this block.
   * @param toBlock - Include all votes casted on or before this block.
   */
  async getVotes({
    account,
    fromBlock,
    toBlock,
  }: {
    account?: ReadVoter | `0x${string}`;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  } = {}): Promise<ReadVote[]> {
    return this.coreVoting.getVotes({
      proposalId: this.id,
      account,
      fromBlock,
      toBlock,
    });
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
    account,
    extraData,
  }: {
    account: ReadVoter | `0x${string}`;
    extraData?: `0x${string}`[];
  }): Promise<bigint> {
    return this.coreVoting.getVotingPower({
      account,
      atBlock: this.created,
      extraData,
    });
  }

  /**
   * Get the total voting power of all votes on this proposal by their ballot.
   */
  async getResults({
    options,
  }: {
    options?: ContractReadOptions;
  } = {}): Promise<VoteResults> {
    const powerByBallot: Record<Ballot, bigint> = {
      yes: 0n,
      no: 0n,
      maybe: 0n,
    };

    // The proposal voting power is deleted when the proposal is executed, so we
    // have to get the results from vote events.
    const isExecuted = await this.getIsExecuted();
    if (isExecuted) {
      const votes = await this.getVotes({
        toBlock: options?.blockNumber ?? options?.blockTag,
      });
      for (const { ballot, power } of votes) {
        powerByBallot[ballot] += power;
      }
    } else {
      const proposalVotingPower = await this.coreVoting.contract.read(
        "getProposalVotingPower",
        { proposalId: this.id },
        options,
      );
      if (Array.isArray(proposalVotingPower)) {
        powerByBallot.yes = proposalVotingPower[0];
        powerByBallot.no = proposalVotingPower[1];
        powerByBallot.maybe = proposalVotingPower[2];
      } else {
        return {
          yes: proposalVotingPower as unknown as bigint,
          no: 0n,
          maybe: 0n,
        };
      }
    }

    return powerByBallot;
  }

  /**
   * Get the current quorum of this proposal measured by summing the voting
   * power of all casted votes.
   */
  async getCurrentQuorum(): Promise<bigint> {
    const results = await this.getResults();
    return Object.values(results).reduce((sum, val) => sum + val, 0n);
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

    const block = await this.network.getBlock();

    if (!block) {
      return false;
    }

    const blockNumber = block.blockNumber;

    if (
      blockNumber === null ||
      blockNumber < unlockBlock ||
      blockNumber > lastCallBlock
    ) {
      return false;
    }

    const currentQuorum = await this.getCurrentQuorum();
    const { yes, no } = await this.getResults();
    return currentQuorum >= requiredQuorum && yes > no;
  }

  /**
   * Idempotent function to ensure all possible data is fetched for the
   * proposal. (From both events and the CoreVoting contract)
   **/
  protected async _getData(): Promise<
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
   * Get the event that was emitted when this proposal was created.
   */
  protected async _getCreatedEvent(): Promise<
    Event<typeof CoreVoting.abi, "ProposalCreated"> | undefined
  > {
    const createdEvents = await this._getCreatedEvents();
    return createdEvents.find(
      ({ args: { proposalId } }) => proposalId === this.id,
    );
  }

  /**
   * Get the ProposalCreated events for the proposal's creation block.
   */
  protected async _getCreatedEvents(): Promise<
    Event<typeof CoreVoting.abi, "ProposalCreated">[]
  > {
    return await this.coreVoting.contract.getEvents("ProposalCreated", {
      fromBlock: this.created,
      toBlock: this.created,
    });
  }

  /**
   * Get the event that was emitted when this proposal was executed, or
   * undefined if it hasn't been executed.
   */
  protected async _getExecutedEvent(): Promise<
    Event<typeof CoreVoting.abi, "ProposalExecuted"> | undefined
  > {
    const executedEvents = await this._getExecutedEvents();
    const found = executedEvents.find(
      ({ args }) => args.proposalId === this.id,
    );

    return found;
  }

  /**
   * Get the ProposalExecuted events within range of this proposal's lifecycle.
   */
  protected async _getExecutedEvents(): Promise<
    Event<typeof CoreVoting.abi, "ProposalExecuted">[]
  > {
    const lastCallBlock = await this.getLastCallBlock();
    const events = await this.coreVoting.contract.getEvents(
      "ProposalExecuted",
      {
        fromBlock: this.created,
        toBlock: lastCallBlock,
      },
    );

    return events;
  }
}
