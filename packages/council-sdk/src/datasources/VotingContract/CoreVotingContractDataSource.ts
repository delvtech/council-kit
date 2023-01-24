import { CoreVoting, CoreVoting__factory } from "@council/typechain";
import { ProposalCreatedEvent } from "@council/typechain/dist/contracts/CoreVoting";
import { Signer } from "ethers";
import { BytesLike, formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context";
import {
  ContractDataSource,
  TransactionOptions,
} from "src/datasources/ContractDataSource";
import {
  Ballot,
  VotingContractDataSource,
  ProposalData,
  VoteData,
  VoteResults,
  ProposalDataPreview,
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
    const proposalCreatedEvents = await this.getProposalCreatedEvents();
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

  async getProposalCreatedEvents(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<ProposalCreatedEvent[]> {
    return this.cached(
      ["getProposalCreatedEvents", fromBlock, toBlock],
      async () => {
        const filter = this.contract.filters.ProposalCreated();
        return this.contract.queryFilter(filter, fromBlock, toBlock);
      },
    );
  }

  async getProposal(id: number): Promise<ProposalData | null> {
    const { proposalHash, quorum, created, unlock, expiration, lastCall } =
      await this.call("proposals", [id]);
    if (proposalHash === EXECUTED_PROPOSAL_HASH) {
      return null;
    }
    const proposalCreatedEvents = await this.getProposalCreatedEvents();
    const createdEvent = proposalCreatedEvents.find(
      ({ args }) => args.proposalId.toNumber() === id,
    );
    if (!createdEvent) {
      return null;
    }

    return {
      id,
      createdTransactionHash: createdEvent.transactionHash,
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
      const events = await this.getProposalCreatedEvents(fromBlock, toBlock);
      return events.map(({ args, transactionHash }) => {
        return {
          id: args.proposalId.toNumber(),
          createdTransactionHash: transactionHash,
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

  getExecutedProposalIds(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<number[]> {
    return this.cached(
      ["getExecutedProposalIds", fromBlock, toBlock],
      async () => {
        const filter = this.contract.filters.ProposalExecuted();
        const events = await this.contract.queryFilter(
          filter,
          fromBlock,
          toBlock,
        );
        return events.map(({ args }) => args.proposalId.toNumber());
      },
    );
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
        const events = await this.contract.queryFilter(
          eventFilter,
          fromBlock,
          toBlock,
        );
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
    const [yesBigNumber, noBigNumber, maybeBigNumber] = await this.call(
      "getProposalVotingPower",
      [proposalId],
    );
    return {
      yes: formatEther(yesBigNumber),
      no: formatEther(noBigNumber),
      maybe: formatEther(maybeBigNumber),
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
