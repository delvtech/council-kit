import { CoreVoting, CoreVoting__factory } from "@council/typechain";
import { ProposalExecutedEvent } from "@council/typechain/dist/contracts/CoreVoting";
import { BigNumber, Signer } from "ethers";
import { BytesLike, formatEther, parseEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context/context";
import {
  ContractDataSource,
  TransactionOptions,
} from "src/datasources/base/contract/ContractDataSource";
import {
  Ballot,
  ProposalData,
  ProposalDataPreview,
  VoteData,
  VoteResults,
  VotingContractDataSource,
} from "./VotingContractDataSource";

const BALLOTS: Ballot[] = ["yes", "no", "maybe"];
const EXECUTED_PROPOSAL_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * A DataSource with methods for making cached calls to a `CoreVoting` contract
 * from the Council protocol.
 * @category Data Sources
 */
export class CoreVotingContractDataSource
  extends ContractDataSource<CoreVoting>
  implements VotingContractDataSource
{
  constructor(address: string, context: CouncilContext) {
    super(CoreVoting__factory.connect(address, context.provider), context);
  }

  async getProposalCount(): Promise<number> {
    return (await this.call("proposalCount", [])).toNumber();
  }

  async getProposalCreatedBy(id: number): Promise<string | null> {
    const eventFilter = this.contract.filters.ProposalCreated();
    const proposalCreatedEvents = await this.getEvents(eventFilter);
    const createdEvent = proposalCreatedEvents.find(
      ({ args }) => args.proposalId.toNumber() === id,
    );
    let createdBy: string | null = null;
    if (createdEvent) {
      createdBy = (
        await this.context.provider.getTransaction(createdEvent.transactionHash)
      ).from;
    }
    return createdBy;
  }

  /**
   * Returns the hash of the transaction that created the proposal. Returns null
   * if the id passed does not correspond to a valid proposal.
   * @param id The id of the proposal
   * @returns The transaction hash
   */
  async getProposalCreatedTransactionHash(id: number): Promise<string | null> {
    const eventFilter = this.contract.filters.ProposalCreated();
    const proposalCreatedEvents = await this.getEvents(eventFilter);
    const createdEvent = proposalCreatedEvents.find(
      ({ args }) => args.proposalId.toNumber() === id,
    );
    if (!createdEvent) {
      return null;
    }

    return createdEvent.transactionHash;
  }

  async getProposal(id: number): Promise<ProposalData | null> {
    const { proposalHash, quorum, created, unlock, expiration, lastCall } =
      await this.call("proposals", [id]);
    if (proposalHash === EXECUTED_PROPOSAL_HASH) {
      return null;
    }

    return {
      id,
      hash: proposalHash,
      requiredQuorum: formatEther(quorum),
      createdBlock: created.toNumber(),
      unlockBlock: unlock.toNumber(),
      expirationBlock: expiration.toNumber(),
      lastCallBlock: lastCall.toNumber(),
    };
  }

  getProposals(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<ProposalDataPreview[]> {
    return this.cached(["getProposals", fromBlock, toBlock], async () => {
      const eventFilter = this.contract.filters.ProposalCreated();
      const events = await this.getEvents(eventFilter, fromBlock, toBlock);
      return events.map(({ args }) => {
        return {
          id: args.proposalId.toNumber(),
          createdBlock: args.created.toNumber(),
          unlockBlock: args.execution.toNumber(),
          expirationBlock: args.expiration.toNumber(),
        };
      });
    });
  }

  /**
   * Create a new proposal.
   * @param signer - An ethers Signer instance for the voter.
   * @param vaults - The addresses of the approved vaults to draw voting power
   *   from.
   * @param targets - The targets (contract addresses) to call.
   * @param calldatas - The calldatas to call each target with.
   * @param lastCall: A block number that limits when the proposal can be executed.
   * @param ballot: The vote for the proposal from the signer's account.
   * @returns The transaction hash.
   */
  async createProposal(
    signer: Signer,
    vaults: string[],
    targets: string[],
    calldatas: BytesLike[],
    lastCall: number,
    ballot: Ballot,
    options?: TransactionOptions & {
      /**
       * Extra data given to the vaults to help calculation
       */
      extraVaultData?: BytesLike[];
    },
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "proposal",
      [
        vaults,
        options?.extraVaultData || vaults.map(() => "0x00"),
        targets,
        calldatas,
        lastCall,
        BALLOTS.indexOf(ballot),
      ],
      signer,
    );
    this.clearCached();
    return transaction.hash;
  }

  getProposalExecutedEvents(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<ProposalExecutedEvent[]> {
    return this.cached(["getProposalExecutedEvents", fromBlock, toBlock], () =>
      this.getEvents(
        this.contract.filters.ProposalExecuted(),
        fromBlock,
        toBlock,
      ),
    );
  }

  async getExecutedProposalIds(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<number[]> {
    const proposalExecutedEvents = await this.getProposalExecutedEvents(
      fromBlock,
      toBlock,
    );
    return proposalExecutedEvents.map(({ args }) => args.proposalId.toNumber());
  }

  async getProposalExecutedTransactionHash(id: number): Promise<string | null> {
    const proposalExecutedEvents = await this.getProposalExecutedEvents();
    const executedEvent = proposalExecutedEvents.find(
      ({ args }) => args.proposalId.toNumber() === id,
    );
    if (!executedEvent) {
      return null;
    }

    return executedEvent.transactionHash;
  }

  async getVote(address: string, proposalId: number): Promise<VoteData | null> {
    const [power, ballotIndex] = await this.call("votes", [
      address,
      proposalId,
    ]);
    return power.gt(0)
      ? {
          address,
          proposalId,
          power: formatEther(power),
          ballot: BALLOTS[ballotIndex],
        }
      : null;
  }

  async getVotes(
    address?: string,
    proposalId?: number,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoteData[]> {
    return this.cached(
      ["getVotes", address, proposalId, fromBlock, toBlock],
      async () => {
        const eventFilter = this.contract.filters.Voted(address, proposalId);
        const events = await this.getEvents(eventFilter, fromBlock, toBlock);
        return events.map(({ args }) => {
          return {
            address: args.voter,
            proposalId: args.proposalId.toNumber(),
            power: formatEther(args.vote.votingPower),
            ballot: BALLOTS[args.vote.castBallot],
          };
        });
      },
    );
  }

  async getResults(proposalId: number): Promise<VoteResults> {
    const executedIds = await this.getExecutedProposalIds();
    const powerByBallot: Record<Ballot, BigNumber> = {
      yes: BigNumber.from(0),
      no: BigNumber.from(0),
      maybe: BigNumber.from(0),
    };

    // The proposal voting power is deleted when the proposal is executed, so we
    // have to get the results from vote events.
    if (executedIds.includes(proposalId)) {
      const votes = await this.getVotes();
      for (const { ballot, power } of votes) {
        const powerBN = parseEther(power);
        powerByBallot[ballot] = powerByBallot[ballot].add(powerBN);
      }
    } else {
      const [yes, no, maybe] = await this.call("getProposalVotingPower", [
        proposalId,
      ]);
      powerByBallot.yes = yes;
      powerByBallot.no = no;
      powerByBallot.maybe = maybe;
    }

    return {
      yes: formatEther(powerByBallot.yes),
      no: formatEther(powerByBallot.no),
      maybe: formatEther(powerByBallot.maybe),
    };
  }

  async vote(
    signer: Signer,
    vaults: string[],
    proposalId: number,
    ballot: Ballot,
    options?: TransactionOptions & {
      /**
       * Extra data given to the vaults to help calculation
       */
      extraVaultData?: BytesLike[];
    },
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "vote",
      [
        vaults,
        options?.extraVaultData || vaults.map(() => "0x00"),
        proposalId,
        BALLOTS.indexOf(ballot),
      ],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }
}
