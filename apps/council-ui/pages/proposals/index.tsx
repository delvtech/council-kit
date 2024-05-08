import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { ReactElement } from "react";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { getBlockDate } from "src/ui/base/utils/getBlockDate";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useReadGscVoting } from "src/ui/council/hooks/useReadGscVoting";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import {
  ProposalRowData,
  ProposalsTable,
} from "src/ui/proposals/ProposalTable/ProposalsTable";
import { ProposalsTableSkeleton } from "src/ui/proposals/ProposalTable/ProposalsTableSkeleton";
import { getProposalStatus } from "src/utils/getProposalStatus";
import { useAccount, usePublicClient } from "wagmi";

export default function ProposalsPage(): ReactElement {
  const { address } = useAccount();
  const { data, error, status } = useProposalsPageData(address);

  return (
    <Page>
      <h1 className="text-5xl font-bold">Proposals</h1>

      {(() => {
        switch (status) {
          case "pending":
            return (
              <div className="w-full">
                <ProposalsTableSkeleton />
              </div>
            );

          case "error":
            return (
              <div className="daisy-mockup-code">
                <code className="block whitespace-pre-wrap px-6 text-error">
                  {error ? String(error) : "Unknown error"}
                </code>
              </div>
            );

          case "success":
            return (
              <div className="w-full">
                <ProposalsTable rowData={data} />
              </div>
            );
          default:
            assertNever(status);
        }
      })()}

      <div className="flex flex-wrap gap-4 md:flex-nowrap">
        <ExternalInfoCard
          header="Check out our docs to learn more about the proposal process."
          body="Click to dive deeper into proposals in Council. "
          href="https://docs-delv.gitbook.io/element-protocol-docs/governance-council/element-governance-proposal-framework/the-governance-process/the-proposal-process-overview"
        />
        <ExternalInfoCard
          header="Learn to create your own on-chain proposals"
          body="Proposals are necessary for any critical governance actions to be executed."
          href="https://docs-delv.gitbook.io/element-protocol-docs/governance-council/element-governance-proposal-framework/the-governance-process/the-proposal-lifecycles/protocol-executable-proposal-lifecycle-breakdown-and-criteria"
        />
      </div>
    </Page>
  );
}

function useProposalsPageData(
  account: `0x${string}` | undefined,
): UseQueryResult<ProposalRowData[]> {
  const coreVoting = useReadCoreVoting();
  const gscVoting = useReadGscVoting();
  const chainId = useSupportedChainId();
  const config = useCouncilConfig();
  const client = usePublicClient();

  return useQuery({
    queryKey: ["proposalsPage", account, chainId],
    queryFn: async (): Promise<ProposalRowData[]> => {
      let allProposals = await coreVoting.getProposals();

      if (gscVoting) {
        const gscProposals = await gscVoting.getProposals();
        allProposals = [...allProposals, ...gscProposals];
      }

      return await Promise.all(
        allProposals.map(async (proposal) => {
          const vote = account
            ? await proposal.getVote({ account })
            : undefined;

          const currentQuorum = await proposal.getCurrentQuorum();

          const requiredQuorum = await proposal.getRequiredQuorum();
          const isExecuted = await proposal.getIsExecuted();
          const results = await proposal.getResults();

          const lastCall = await proposal.getLastCallBlock();
          const lastCallDate = lastCall
            ? await getBlockDate(lastCall, client)
            : undefined;

          const createdDate = await getBlockDate(proposal.created, client);
          const votingEnds = await getBlockDate(proposal.expiration, client);

          const status = getProposalStatus({
            isExecuted,
            currentQuorum,
            lastCallDate,
            requiredQuorum,
            results,
          });

          const isGsc = proposal.coreVoting.address === gscVoting?.address;
          const proposalConfig = isGsc
            ? config.gscVoting?.proposals[String(proposal.id)]
            : config.coreVoting.proposals[String(proposal.id)];

          const result: ProposalRowData = {
            status,
            coreVotingAddress: proposal.coreVoting.address,
            votingContractName: proposal.coreVoting.name,
            id: proposal.id,
            created: createdDate,
            votingEnds,
            currentQuorum,
            ballot: vote && vote.power > BigInt(0) ? vote.ballot : undefined,
            sentenceSummary: proposalConfig?.sentenceSummary,
            title: proposalConfig?.title,
          };
          return result;
        }),
      );
    },
  });
}
