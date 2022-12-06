import { CoreVoting, CoreVoting__factory } from "@council/typechain";
import { Signer } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context";
import { ContractDataSource } from "src/datasources/ContractDataSource";
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

  async getProposal(id: number): Promise<ProposalData | null> {
    const { proposalHash, quorum, created, unlock, expiration, lastCall } =
      await this.call("proposals", [id]);
    return proposalHash === EXECUTED_PROPOSAL_HASH
      ? null
      : {
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
      const filter = this.contract.filters.ProposalCreated();
      const events = await this.contract.queryFilter(
        filter,
        fromBlock,
        toBlock,
      );
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
  ): Promise<string> {
    const contract = this.contract.connect(signer);
    const transaction = await contract.vote(
      vaults,
      vaults.map(() => "0x00"),
      proposalId,
      BALLOTS.indexOf(ballot),
    );
    await transaction.wait(); // will throw an error if transaction fails
    this.deleteCall("votes", [await signer.getAddress(), proposalId]);
    return transaction.hash;
  }
}
