import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import {
  Adapter,
  Address,
  Contract,
  ContractReadOptions,
} from "@delvtech/drift";
import { ContractEntityConfig, Entity } from "src/entities/Entity";
import {
  BALLOTS,
  EXECUTED_PROPOSAL_HASH,
} from "src/entities/coreVoting/constants";
import { Proposal, ProposalArgs, Vote } from "src/entities/coreVoting/types";
import { Blockish } from "src/utils/types";

export class ReadCoreVoting<A extends Adapter = Adapter> extends Entity<A> {
  readonly address: Address;
  readonly contract: Contract<typeof CoreVoting.abi, A>;

  constructor({ address, ...config }: ContractEntityConfig<A>) {
    super(config);
    this.address = address;
    this.contract = this.drift.contract({
      abi: CoreVoting.abi,
      address,
    });
  }

  /**
   * Get a proposal by id.
   */
  async getProposal(
    proposalId: bigint,
    options?: ContractReadOptions,
  ): Promise<Proposal | undefined> {
    const { created, expiration, lastCall, proposalHash, quorum, unlock } =
      await this.contract.read("proposals", [proposalId], options);
    if (proposalHash !== EXECUTED_PROPOSAL_HASH) {
      return {
        proposalId,
        createdBlock: created,
        expirationBlock: expiration,
        lastCallBlock: lastCall,
        proposalHash,
        requiredQuorum: quorum,
        unlockBlock: unlock,
      };
    }
  }

  /**
   * Get proposal creation events.
   */
  async getProposals(
    options: {
      fromBlock?: Blockish;
      toBlock?: Blockish;
    } = {},
  ): Promise<ProposalArgs[]> {
    const createdEvents = await this.contract.getEvents(
      "ProposalCreated",
      options,
    );
    return createdEvents.map(
      ({ args: { proposalId, created, execution, expiration } }) => {
        return {
          proposalId,
          createdBlock: created,
          expirationBlock: expiration,
          unlockBlock: execution,
        };
      },
    );
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
    fromBlock?: Blockish;
    toBlock?: Blockish;
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

  getIsVaultApproved(
    vault: Address,
    options?: ContractReadOptions,
  ): Promise<boolean> {
    return this.contract.read("approvedVaults", [vault], options);
  }
}
