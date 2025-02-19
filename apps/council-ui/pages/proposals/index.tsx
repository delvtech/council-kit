import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { ReactElement } from "react";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { getBlockDate } from "src/ui/base/utils/getBlockDate";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import {
  ProposalRowData,
  ProposalsTable,
} from "src/ui/proposals/ProposalTable/ProposalsTable";
import { ProposalsTableSkeleton } from "src/ui/proposals/ProposalTable/ProposalsTableSkeleton";
import { useReadCouncil } from "src/ui/sdk/hooks/useReadCouncil";
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
                <code className="text-error block px-6 whitespace-pre-wrap">
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
          href="https://docs-delv.gitbook.io/element-developer-docs/governance-council/element-governance-proposal-framework/the-governance-process/the-proposal-process-overview"
        />
        <ExternalInfoCard
          header="Learn to create your own on-chain proposals"
          body="Proposals are necessary for any critical governance actions to be executed."
          href="https://docs-delv.gitbook.io/element-developer-docs/governance-council/element-governance-proposal-framework/the-governance-process/the-proposal-lifecycles/protocol-executable-proposal-lifecycle-breakdown-and-criteria"
        />
      </div>
    </Page>
  );
}

function useProposalsPageData(
  account: `0x${string}` | undefined,
): UseQueryResult<ProposalRowData[]> {
  const chainId = useSupportedChainId();
  const config = useCouncilConfig();
  const client = usePublicClient();
  const council = useReadCouncil();

  return useQuery({
    queryKey: ["proposalsPage", account, chainId],
    queryFn: async (): Promise<ProposalRowData[]> => {
      const coreVoting = council.coreVoting(config.coreVoting.address);
      const gscVoting = config.gscVoting
        ? council.coreVoting(config.gscVoting.address)
        : undefined;

      const [coreProposals, gscProposals] = await Promise.all([
        coreVoting.getProposals(),
        gscVoting?.getProposals(),
      ]);

      const allProposals = coreProposals.map((proposal) => {
        return {
          ...proposal,
          votingContract: coreVoting,
        };
      });

      if (gscProposals) {
        allProposals.push(
          ...gscProposals.map((proposal) => {
            return {
              ...proposal,
              votingContract: gscVoting!,
            };
          }),
        );
      }

      return await Promise.all(
        allProposals.map(
          async ({
            createdBlock,
            expirationBlock,
            proposalId,
            votingContract,
          }) => {
            const [proposal, results, executionEvent, vote] = await Promise.all(
              [
                coreVoting.getProposal(proposalId),
                coreVoting.getProposalVotingPower(proposalId),
                coreVoting.getProposalExecution(proposalId),
                account
                  ? await coreVoting.getVote({ proposalId, voter: account })
                  : undefined,
              ],
            );

            const [lastCallDate, createdDate, votingEnds] = await Promise.all([
              proposal?.lastCallBlock
                ? getBlockDate(proposal?.lastCallBlock, client)
                : undefined,
              getBlockDate(createdBlock, client),
              getBlockDate(expirationBlock, client),
            ]);

            const currentQuorum = results.yes + results.no + results.maybe;
            const status = getProposalStatus({
              isExecuted: !!executionEvent,
              currentQuorum,
              lastCallDate,
              requiredQuorum: proposal?.requiredQuorum,
              results,
            });

            const proposalConfig =
              votingContract.address === gscVoting?.address
                ? config.gscVoting?.proposals[String(proposalId)]
                : config.coreVoting.proposals[String(proposalId)];

            const result: ProposalRowData = {
              id: proposalId,
              title: proposalConfig?.title,
              sentenceSummary: proposalConfig?.sentenceSummary,
              status,
              created: createdDate,
              currentQuorum,
              ballot: vote?.votingPower ? vote.ballot : undefined,
              votingEnds,
              votingContract,
            };
            return result;
          },
        ),
      );
    },
  });
}
