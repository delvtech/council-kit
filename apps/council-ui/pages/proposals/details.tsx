import { Ballot, getBlockDate, Proposal, Vote } from "@council/sdk";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { councilConfigs } from "src/config/council.config";
import { EnsRecords, getBulkEnsRecords } from "src/ens/getBulkEnsRecords";
import {
  getProposalStatus,
  ProposalStatus,
} from "src/proposals/getProposalStatus";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { ProposalStatsRow } from "src/ui/proposals/ProposalStatsRow/ProposalStatsRow";
import { ProposalStatsRowSkeleton } from "src/ui/proposals/ProposalStatsRow/ProposalStatsRowSkeleton";
import { Quorum } from "src/ui/proposals/Quorum/Quorum";
import { QuorumBarSkeleton } from "src/ui/proposals/Quorum/QuorumSkeleton";
import { VotingActivityTable } from "src/ui/proposals/VotingActivityTable/VotingActivityTable";
import { VotingActivityTableSkeleton } from "src/ui/proposals/VotingActivityTable/VotingActivityTableSkeleton";
import { useGSCMemberAddresses } from "src/ui/vaults/gscVault/useGSCMembers";
import { GSCOnlyToggle } from "src/ui/voters/GSCOnlyToggle";
import { useGSCVote } from "src/ui/voting/hooks/useGSCVote";
import { useVote } from "src/ui/voting/hooks/useVote";
import { ProposalVoting } from "src/ui/voting/ProposalVoting";
import { ProposalVotingSkeleton } from "src/ui/voting/ProposalVotingSkeleton";
import { useAccount, useBlockNumber, useSigner } from "wagmi";

export default function ProposalPage(): ReactElement {
  const { query, replace } = useRouter();
  const { id: idParam, votingContract: votingContractAddressParam } = query;

  const id = +(idParam as string);
  const votingContractAddress = votingContractAddressParam as string;

  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber();

  const { data, error, status } = useProposalDetailsPageData(
    votingContractAddress,
    id,
    address,
  );
  const { data: gscMemberAddresses } = useGSCMemberAddresses();

  // voting activity filtering
  const [gscOnly, setGscOnly] = useState(false);
  const filteredVotes = useMemo(() => {
    if (data && gscOnly && gscMemberAddresses) {
      return data.votes.filter(({ voter }) =>
        gscMemberAddresses.includes(voter.address),
      );
    }
    return data?.votes;
  }, [data, gscOnly, gscMemberAddresses]);

  const { mutate: vote } = useVote();
  const { mutate: gscVote } = useGSCVote();

  const handleVote = (ballot: Ballot) => {
    if (!data || !signer) {
      return;
    }
    const voteArgs = {
      signer,
      proposalId: id,
      ballot,
    };
    if (data.type === "gsc") {
      return gscVote(voteArgs);
    }
    return vote(voteArgs);
  };

  if (!votingContractAddressParam || !idParam) {
    replace("/404");
    // User will go to 404 page if this block is reached
    // Returning empty fragment is to remove the undefined type from the query params.
    return <></>;
  }

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  return (
    <Page>
      <div className="flex flex-wrap w-full gap-y-8">
        <div className="flex flex-col">
          <h1 className="mb-1 text-5xl font-bold">
            {data?.proposalName ?? `Proposal ${id}`}
          </h1>
          {data?.descriptionURL && (
            <ExternalLink href={data.descriptionURL} iconSize={18}>
              Learn more about this proposal
            </ExternalLink>
          )}
        </div>

        <div className="w-full sm:ml-auto sm:w-96">
          {status === "success" ? (
            <Quorum
              current={data.currentQuorum}
              required={data.requiredQuorum}
              status={data.status}
            />
          ) : (
            <QuorumBarSkeleton />
          )}
        </div>
      </div>

      {status === "success" ? (
        <ProposalStatsRow
          votingContractName={data.votingContractName}
          votingContractAddress={votingContractAddress}
          createdBy={data.createdBy}
          createdTransactionHash={data.createdTransactionHash}
          endsAtDate={data.endsAtDate}
          unlockAtDate={data.unlockedAtDate}
          lastCallAtDate={data.lastCallAtDate}
          executedTransactionHash={data.executedTransactionHash}
          status={data.status}
          className="mb-2"
        />
      ) : (
        <ProposalStatsRowSkeleton />
      )}

      <div className="flex flex-wrap w-full gap-20 sm:gap-y-0">
        <div className="flex min-w-[280px] grow flex-col gap-y-4 sm:basis-[50%]">
          {status === "success" ? (
            data.paragraphSummary && (
              <p className="mb-5 text-lg">{data.paragraphSummary}</p>
            )
          ) : (
            <Skeleton count={3} className="mb-5 text-lg" />
          )}
          <div className="flex">
            <h1 className="text-2xl font-medium">
              Voting Activity {filteredVotes && `(${filteredVotes.length})`}
            </h1>

            {gscMemberAddresses && (
              <GSCOnlyToggle
                on={gscOnly}
                onToggle={setGscOnly}
                disabled={status !== "success"}
                className="ml-auto"
              />
            )}
          </div>

          {status === "success" && filteredVotes ? (
            <VotingActivityTable
              votes={filteredVotes}
              voterEnsRecords={data.voterEnsRecords}
            />
          ) : (
            <VotingActivityTableSkeleton />
          )}
        </div>

        <div className="grow basis-[300px] md:grow-0">
          <h2 className="mb-2 text-2xl font-medium">Your Vote</h2>

          {status === "success" ? (
            <ProposalVoting
              atBlock={data.createdAtBlock || blockNumber}
              account={address}
              accountBallot={data?.accountBallot}
              disabled={!signer || !data?.isActive}
              onVote={handleVote}
            />
          ) : (
            <ProposalVotingSkeleton />
          )}
        </div>
      </div>
    </Page>
  );
}

interface ProposalDetailsPageData {
  type: "core" | "gsc";
  proposalName: string;
  votingContractName: string;
  status: ProposalStatus;
  isActive: boolean;
  currentQuorum: string;
  requiredQuorum: string | null;
  createdAtBlock: number | null;
  createdBy: string | null;
  createdAtDate: Date | null;
  createdTransactionHash: string | null;
  endsAtDate: Date | null;
  unlockedAtDate: Date | null;
  lastCallAtDate: Date | null;
  votes: Vote[];
  accountBallot?: Ballot;
  voterEnsRecords: EnsRecords;
  descriptionURL: string | null;
  paragraphSummary: string | null;
  executedTransactionHash: string | null;
}

function useProposalDetailsPageData(
  votingContractAddress?: string,
  id?: number,
  account?: string,
) {
  const { context, coreVoting, gscVoting } = useCouncil();
  const provider = context.provider;
  const chainId = useChainId();
  const proposalConfig = councilConfigs[chainId].coreVoting.proposals;
  const votingContractName = councilConfigs[chainId].coreVoting.name;

  const queryEnabled = votingContractAddress !== undefined && id !== undefined;
  return useQuery<ProposalDetailsPageData>({
    queryKey: ["proposalDetailsPage", id],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<ProposalDetailsPageData> => {
          let proposal: Proposal | undefined;
          let type: ProposalDetailsPageData["type"] = "core";

          if (votingContractAddress === coreVoting.address) {
            proposal = coreVoting.getProposal(id);
          } else if (votingContractAddress === gscVoting?.address) {
            type = "gsc";
            proposal = gscVoting.getProposal(id);
          } else {
            throw new Error(
              `No config found for voting contract address ${votingContractAddress}, See src/config.`,
            );
          }

          const createdTransactionHash =
            await proposal.getCreatedTransactionHash();
          const createdAtBlock = await proposal.getCreatedBlock();
          const createdAtDate = createdAtBlock
            ? await getBlockDate(createdAtBlock, provider)
            : null;

          const endsAtBlock = await proposal.getExpirationBlock();
          const endsAtDate = endsAtBlock
            ? await getBlockDate(endsAtBlock, provider, {
                estimateFutureDates: true,
              })
            : null;

          const unlockedAtBlock = await proposal.getUnlockBlock();
          const unlockedAtDate = unlockedAtBlock
            ? await getBlockDate(unlockedAtBlock, provider, {
                estimateFutureDates: true,
              })
            : null;

          const lastCallAtBlock = await proposal.getLastCallBlock();
          const lastCallAtDate = lastCallAtBlock
            ? await getBlockDate(lastCallAtBlock, provider, {
                estimateFutureDates: true,
              })
            : null;

          const votes = await proposal.getVotes();
          const voterEnsRecords = await getBulkEnsRecords(
            Array.from(new Set(votes.map((vote) => vote.voter.address))),
            provider,
          );

          const currentQuorum = await proposal.getCurrentQuorum();
          const requiredQuorum = await proposal.getRequiredQuorum();

          return {
            type,
            proposalName: proposal.name,
            votingContractName,
            status: getProposalStatus({
              isExecuted: await proposal.getIsExecuted(),
              endsAtDate,
              currentQuorum,
              requiredQuorum,
            }),
            isActive: await proposal.getIsActive(),
            currentQuorum,
            requiredQuorum,
            createdAtBlock,
            createdBy: await proposal.getCreatedBy(),
            createdAtDate,
            endsAtDate,
            unlockedAtDate,
            lastCallAtDate,
            votes: await proposal.getVotes(),
            voterEnsRecords,
            createdTransactionHash,
            accountBallot: account
              ? (await proposal.getVote(account))?.ballot
              : undefined,
            descriptionURL: proposalConfig[id]?.descriptionURL ?? null,
            paragraphSummary: proposalConfig[id]?.paragraphSummary ?? null,
            executedTransactionHash:
              await proposal.getExecutedTransactionHash(),
          };
        }
      : undefined,
  });
}
