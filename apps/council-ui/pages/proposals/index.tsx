import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { ReactElement } from "react";
import { getProposalConfig } from "src/config/utils/getProposalConfig";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { getBlockDate } from "src/ui/base/utils/getBlockDate";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import {
  ProposalRowData,
  ProposalsTable,
} from "src/ui/proposals/ProposalTable/ProposalsTable";
import { ProposalsTableSkeleton } from "src/ui/proposals/ProposalTable/ProposalsTableSkeleton";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";
import { useAccount } from "wagmi";

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
  const council = useReadCouncil();
  const enabled = !!council;
  return useQuery({
    queryKey: ["proposalsPage", account, chainId],
    enabled,
    queryFn: enabled
      ? async (): Promise<ProposalRowData[]> => {
          const generalVoting = council.coreVoting(config.coreVoting.address);
          const gscVoting = config.gscVoting
            ? council.coreVoting(config.gscVoting.address)
            : undefined;

          const [generalProposals, gscProposals] = await Promise.all([
            generalVoting.getProposalCreations(),
            gscVoting?.getProposalCreations(),
          ]);

          const allProposals = generalProposals.concat(gscProposals || []);

          return await Promise.all(
            allProposals.map(
              async ({ coreVotingAddress, proposalId, expirationBlock }) => {
                const proposalConfig = getProposalConfig({
                  chainId,
                  votingContract: coreVotingAddress,
                  id: proposalId,
                });

                const votingContract = council.coreVoting(coreVotingAddress);
                const [votingEnds, status, vote] = await Promise.all([
                  getBlockDate(expirationBlock, chainId),
                  votingContract.getProposalStatus(proposalId),
                  account
                    ? await votingContract.getVote({
                        proposalId: proposalId,
                        voter: account,
                      })
                    : undefined,
                ]);

                const result: ProposalRowData = {
                  id: proposalId,
                  title: proposalConfig?.title,
                  sentenceSummary: proposalConfig?.sentenceSummary,
                  status,
                  ballot: vote?.votingPower ? vote.ballot : undefined,
                  votingEnds,
                  votingContract,
                };

                return result;
              },
            ),
          );
        }
      : undefined,
  });
}
