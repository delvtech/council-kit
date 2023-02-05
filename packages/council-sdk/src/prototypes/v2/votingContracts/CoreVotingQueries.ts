import { CoreVoting, CoreVoting__factory } from "@council/typechain";
import {
  ProposalCreatedEvent,
  ProposalExecutedEvent,
} from "@council/typechain/dist/contracts/CoreVoting";
import { Provider } from "@ethersproject/abstract-provider";
import { QueryClient } from "@tanstack/query-core";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { makeQueryKey } from "src/prototypes/v2/base/makeQueryKey";
import { makeQueryObject } from "src/prototypes/v2/base/makeQueryObject";
import { QueryObject } from "src/prototypes/v2/base/QueryObject";
import { VotingVaultQueries } from "src/prototypes/v2/vaults/VotingVaultQueries";
import { ProposalQuorum } from "src/prototypes/v2/votingContracts/types/ProposalQuorum";
import { VoteData } from "src/prototypes/v2/votingContracts/types/VoteData";
import { ProposalMetadata } from "./types/ProposalMetadata";

export class CoreVotingQueries {
  address: string;
  private approvedVaultQueries: VotingVaultQueries[];
  private contractInstance: CoreVoting;
  private queryClient: QueryClient;
  private provider: Provider;

  constructor(
    address: string,
    approvedVaults: string[],
    queryClient: QueryClient,
    provider: Provider,
  ) {
    this.queryClient = queryClient;
    this.provider = provider;
    this.address = address;
    this.contractInstance = CoreVoting__factory.connect(address, provider);
    this.approvedVaultQueries = approvedVaults.map(
      (vaultAddress) =>
        new VotingVaultQueries(vaultAddress, queryClient, provider),
    );
  }
  private async getProposalBlockTag(proposalId: number) {
    // The contract deletes the info for executed proposals, so we query
    // the blockchain at the block just before execution
    const proposalExecutedEvent = await this.getProposalExecutedEvent(
      proposalId,
    ).fetch();
    return proposalExecutedEvent
      ? proposalExecutedEvent.blockNumber - 1
      : undefined;
  }
  getProposalCount(): QueryObject<number> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getProposalCount"),
      queryFn: async () =>
        (await this.contractInstance.proposalCount()).toNumber(),
    });
  }
  getVoterBallots({
    voter,
    proposalId,
    fromBlock,
    toBlock,
  }: {
    voter?: string;
    proposalId?: number;
    fromBlock?: number;
    toBlock?: number;
  } = {}): QueryObject<VoteData[]> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getVoterBallot", {
        voter,
        proposalId,
        fromBlock,
        toBlock,
      }),
      queryFn: async () => {
        const events = await this.contractInstance.queryFilter(
          this.contractInstance.filters.Voted(voter, proposalId),
          fromBlock,
          toBlock,
        );

        return events.map(({ args }): VoteData => {
          return {
            voter: args.voter,
            proposalId: args.proposalId.toNumber(),
            power: formatEther(args.vote.votingPower),
            ballot: args.vote.castBallot,
          };
        });
      },
    });
  }
  getProposalExecutedEvents(
    fromBlock?: number,
    toBlock?: number,
  ): QueryObject<ProposalExecutedEvent[]> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getProposalExecutedEvents", {
        fromBlock,
        toBlock,
      }),
      queryFn: () => {
        return this.contractInstance.queryFilter(
          this.contractInstance.filters.ProposalExecuted(),
          fromBlock,
          toBlock,
        );
      },
      // event data never changes, cache this forever
      staleTime: Infinity,
    });
  }
  getProposalExecutedEvent(
    proposalId: number,
  ): QueryObject<ProposalExecutedEvent | undefined> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getProposalExecutedEvent", {
        proposalId,
      }),
      queryFn: async () => {
        const proposalExecutedEvents =
          await this.getProposalExecutedEvents().fetch();
        return proposalExecutedEvents.find(
          ({ args }) => args.proposalId.toNumber() === proposalId,
        );
      },
      // event data never changes, cache this forever
      staleTime: Infinity,
    });
  }
  getProposalCreatedEvents(
    fromBlock?: number,
    toBlock?: number,
  ): QueryObject<ProposalCreatedEvent[]> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getProposalCreatedEvents", {
        fromBlock,
        toBlock,
      }),
      queryFn: () => {
        return this.contractInstance.queryFilter(
          this.contractInstance.filters.ProposalCreated(),
          fromBlock,
          toBlock,
        );
      },
      // event data never changes, cache this forever
      staleTime: Infinity,
    });
  }
  getProposalCreatedEvent(
    proposalId: number,
  ): QueryObject<ProposalCreatedEvent | undefined> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getProposalCreatedEvent", {
        proposalId,
      }),
      queryFn: async () => {
        const proposalCreatedEvents =
          await this.getProposalCreatedEvents().fetch();
        return proposalCreatedEvents.find(
          ({ args }) => args.proposalId.toNumber() === proposalId,
        );
      },
      // event data never changes, cache this forever
      staleTime: Infinity,
    });
  }
  getProposalStatus(
    proposalId: number,
  ): QueryObject<
    "NOT_FOUND" | "IN_PROGRESS" | "EXECUTED" | "EXPIRED" | "FAILED"
  > {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getProposalStatus", { proposalId }),
      queryFn: async () => {
        const proposalCreatedEvent = await this.getProposalCreatedEvent(
          proposalId,
        ).fetch();
        if (!proposalCreatedEvent) {
          return "NOT_FOUND";
        }

        const proposalExecutedEvent = await this.getProposalExecutedEvent(
          proposalId,
        ).fetch();
        const isProposalExecuted = !!proposalExecutedEvent;
        if (isProposalExecuted) {
          return "EXECUTED";
        }

        const isExpired =
          proposalCreatedEvent.args.expiration.toNumber() < Date.now() / 1000;
        if (isExpired) {
          const {
            currentQuorum,
            requiredQuorum,
            votes: { yes, no },
          } = await this.getProposalQuorum(proposalId).fetch();
          const isQuorumMet = currentQuorum.gte(requiredQuorum);
          const isMajorityNo = no.gt(yes);
          if (!isQuorumMet || isMajorityNo) {
            return "FAILED";
          }
          return "EXPIRED";
        }

        return "IN_PROGRESS";
      },
    });
  }
  getProposalQuorum(proposalId: number): QueryObject<ProposalQuorum> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getProposalVotingPower", {
        proposalId,
      }),
      queryFn: async () => {
        const { quorum: requiredQuorum } = await this.getProposalMetadata(
          proposalId,
        ).fetch();
        const blockTag = await this.getProposalBlockTag(proposalId);
        const [yeses, nos, maybes] =
          await this.contractInstance.getProposalVotingPower(proposalId, {
            blockTag,
          });
        const currentQuorum = yeses.add(nos).add(maybes);
        return {
          requiredQuorum,
          currentQuorum,
          votes: { yes: yeses, no: nos, maybe: maybes },
        };
      },
    });
  }
  getProposalMetadata(proposalId: number): QueryObject<ProposalMetadata> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getProposal", { proposalId }),
      queryFn: async (): Promise<ProposalMetadata> => {
        const proposalCreatedEvent = await this.getProposalCreatedEvent(
          proposalId,
        ).fetch();
        const proposalExecutedEvent = await this.getProposalExecutedEvent(
          proposalId,
        ).fetch();

        // The contract deletes the info for executed proposals, so we query
        // the blockchain at the block just before execution
        const blockTag = await this.getProposalBlockTag(proposalId);
        const proposal = await this.contractInstance.proposals(proposalId, {
          blockTag,
        });

        return {
          proposalHash: proposal.proposalHash,
          createdTransactionHash: proposalCreatedEvent?.transactionHash || null,
          executedTransactionHash:
            proposalExecutedEvent?.transactionHash || null,
          created: proposal.created.toNumber(),
          unlock: proposal.unlock.toNumber(),
          expiration: proposal.expiration.toNumber(),
          quorum: proposal.quorum,
          lastCall: proposal.lastCall.toNumber(),
        };
      },
      // Metadata never changes, cache this forever
      staleTime: Infinity,
    });
  }
  getTotalVotingPowerForAddress(
    address: string,
    blockNumber?: number,
  ): QueryObject<BigNumber> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getTotalVotingPowerForAddress", {
        address,
      }),
      queryFn: async () => {
        const votingPowers = await Promise.all(
          this.approvedVaultQueries.map(async (vaultQueries) =>
            vaultQueries
              .getQueryVotePower(
                address,
                blockNumber || (await this.provider.getBlockNumber()),
              )
              .fetch(),
          ),
        );

        return votingPowers.reduce(
          (current, sum) => sum.add(current),
          BigNumber.from(0),
        );
      },
      // queryVotePower data never changes since it's tied to blockNumber
      staleTime: Infinity,
    });
  }
}
