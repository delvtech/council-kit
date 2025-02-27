import {
  Adapter,
  Address,
  Contract,
  ContractReadOptions,
  RangeBlock,
} from "@delvtech/drift";
import { ContractEntityConfig, Entity } from "src/entities/Entity";
import { coreVotingAbi, CoreVotingAbi } from "src/entities/coreVoting/abi";
import {
  BALLOTS,
  EXECUTED_PROPOSAL_HASH,
} from "src/entities/coreVoting/constants";
import {
  Proposal,
  ProposalCreation,
  ProposalStatus,
  Vote,
  VoteResults,
} from "src/entities/coreVoting/types";
import { convertToBlockNumber } from "src/utils/convertToBlockNumber";
import { convertToRangeBlock } from "src/utils/convertToRangeBlock";

export class ReadCoreVoting<A extends Adapter = Adapter> extends Entity<A> {
  readonly address: Address;
  readonly contract: Contract<CoreVotingAbi, A>;

  constructor({ address, ...config }: ContractEntityConfig<A>) {
    super(config);
    this.address = address;
    this.contract = this.drift.contract({
      abi: coreVotingAbi,
      address,
    });
  }

  getIsVaultApproved(
    vault: Address,
    options?: ContractReadOptions,
  ): Promise<boolean> {
    return this.contract.read("approvedVaults", [vault], options);
  }

  /**
   * Get a casted vote for a given address on a given proposal id.
   */
  async getVote({
    voter,
    proposalId,
  }: {
    voter: Address;
    proposalId: bigint;
  }): Promise<Vote | undefined> {
    const { castBallot, votingPower } = await this.contract.read("votes", [
      voter,
      proposalId,
    ]);

    if (votingPower === 0n) {
      return;
    }

    return {
      proposalId,
      ballot: BALLOTS[castBallot],
      votingPower,
      voter,
    };
  }

  /**
   * Get all casted votes on proposals in this voting contract.
   */
  async getVotes({
    proposalId,
    voter,
    fromBlock,
    toBlock,
  }: {
    proposalId?: bigint;
    voter?: Address;
    fromBlock?: RangeBlock;
    toBlock?: RangeBlock;
  }): Promise<Vote[]> {
    const voteEvents = await this.contract.getEvents("Voted", {
      filter: { proposalId, voter },
      fromBlock,
      toBlock,
    });

    return voteEvents.map(({ args: { proposalId, vote, voter } }) => {
      return {
        proposalId,
        ballot: BALLOTS[vote.castBallot],
        votingPower: vote.votingPower,
        voter,
      };
    });
  }

  /**
   * Get a proposal by id.
   */
  async getProposal(
    proposalId: bigint,
    options?: ContractReadOptions,
  ): Promise<Proposal> {
    const { created, expiration, lastCall, proposalHash, quorum, unlock } =
      await this.contract.read("proposals", [proposalId], options);

    if (proposalHash === EXECUTED_PROPOSAL_HASH) {
      const creationEvents = await this.contract.getEvents("ProposalCreated", {
        toBlock: await convertToRangeBlock(options?.block, this.drift),
      });
      const creationEvent = creationEvents.find(
        ({ args }) => args.proposalId === proposalId,
      );

      if (!creationEvent) {
        return {
          proposalId,
          proposalHash,
          coreVoting: this.address,
          status: "unknown",
        };
      }

      return {
        proposalId,
        proposalHash,
        coreVoting: this.address,
        status: "executed",
        createdBlock: creationEvent?.args.created,
        expirationBlock: creationEvent?.args.expiration,
        unlockBlock: creationEvent?.args.execution,
      };
    }

    return {
      proposalId,
      proposalHash,
      coreVoting: this.address,
      createdBlock: created,
      expirationBlock: expiration,
      lastCallBlock: lastCall,
      requiredQuorum: quorum,
      unlockBlock: unlock,
    };
  }

  /**
   * Get proposal creation events.
   */
  async getProposalCreations(
    options: {
      fromBlock?: RangeBlock;
      toBlock?: RangeBlock;
    } = {},
  ): Promise<ProposalCreation[]> {
    const events = await this.contract.getEvents("ProposalCreated", options);
    let result: ProposalCreation[] = [];
    for (const { args, blockNumber, transactionHash } of events) {
      // Filter out pending blocks.
      if (transactionHash && blockNumber !== undefined) {
        result.push({
          blockNumber,
          transactionHash,
          coreVoting: this.address,
          proposalId: args.proposalId,
          createdBlock: args.created,
          expirationBlock: args.expiration,
          unlockBlock: args.execution,
        });
      }
    }
    return result;
  }

  /**
   * Get the status of a proposal.
   */
  async getProposalStatus(
    proposalId: bigint,
    options?: ContractReadOptions,
  ): Promise<ProposalStatus> {
    const { lastCall, proposalHash, quorum } = await this.contract.read(
      "proposals",
      [proposalId],
      options,
    );

    if (proposalHash === EXECUTED_PROPOSAL_HASH) {
      const creationEvents = await this.contract.getEvents("ProposalCreated", {
        toBlock: await convertToRangeBlock(options?.block, this.drift),
      });
      const event = creationEvents.find(
        ({ args }) => args.proposalId === proposalId,
      );
      if (event) {
        return "executed";
      }
      return "unknown";
    }

    let currentBlock = await convertToBlockNumber(options?.block, this.drift);
    if (currentBlock === undefined) {
      currentBlock = await this.drift.getBlockNumber();
    }

    if (currentBlock > lastCall) {
      const { total, yes, no } = await this.getProposalVotingPower(
        proposalId,
        options,
      );
      if (total >= quorum && yes > no) {
        return "expired";
      }
      return "failed";
    }

    return "active";
  }

  /**
   * Get the total voting power of all votes on a proposal by ballot.
   */
  async getProposalVotingPower(
    proposalId: bigint,
    options?: ContractReadOptions,
  ): Promise<VoteResults> {
    const proposal = await this.getProposal(proposalId, options);

    // The proposal voting power is deleted when the proposal is executed, so we
    // have to get the results from vote events.
    if (
      !proposal?.proposalHash ||
      proposal.proposalHash === EXECUTED_PROPOSAL_HASH
    ) {
      const votes = await this.getVotes({
        toBlock: await convertToRangeBlock(options?.block, this.drift),
        proposalId,
      });
      const results: VoteResults = {
        yes: 0n,
        no: 0n,
        maybe: 0n,
        total: 0n,
      };
      for (const { ballot, votingPower } of votes) {
        results[ballot] += votingPower;
        results.total += votingPower;
      }
      return results;
    }

    const [yes, no, maybe] = await this.contract.read(
      "getProposalVotingPower",
      { proposalId },
      options,
    );
    return { yes, no, maybe, total: yes + no + maybe };
  }
}
