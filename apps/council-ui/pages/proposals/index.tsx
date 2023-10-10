import { getBlockDate } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { parseEther } from "ethers/lib/utils";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { ProposalConfig } from "src/config/CouncilConfig";
import { getProposalStatus } from "src/proposals/getProposalStatus";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import {
  ProposalRowData,
  ProposalsTable,
} from "src/ui/proposals/ProposalTable/ProposalsTable";
import { ProposalsTableSkeleton } from "src/ui/proposals/ProposalTable/ProposalsTableSkeleton";
import { useAccount } from "wagmi";

export default function ProposalsPage(): ReactElement {
  const { address } = useAccount();
  const { data, error, status } = useProposalsPageData(address);

  return (
    <Page>
      <h1 className="text-5xl font-bold">Proposals</h1>

      {(() => {
        switch (status) {
          case "loading":
            return (
              <div className="w-full">
                <ProposalsTableSkeleton />
              </div>
            );

          case "error":
            return (
              <div className="daisy-mockup-code">
                <code className="block px-6 whitespace-pre-wrap text-error">
                  {error ? (error as string).toString() : "Unknown error"}
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
          header="Learn about the proposal process."
          body="Check out the Element Governance Proposal Framework"
          href="https://docs.element.fi/governance-council/element-governance-proposal-framework/the-governance-process/the-proposal-process-overview"
        />
        <ExternalInfoCard
          header="How do I create an on-chain proposal?"
          body="Check out the Proposal Lifecycle Breakdown & Criteria"
          href="https://docs.element.fi/governance-council/element-governance-proposal-framework/the-governance-process/the-proposal-lifecycles/protocol-executable-proposal-lifecycle-breakdown-and-criteria"
        />
      </div>
    </Page>
  );
}

function useProposalsPageData(
  account: string | undefined,
): UseQueryResult<ProposalRowData[]> {
  const { context, coreVoting, gscVoting } = useCouncil();
  const chainId = useChainId();
  const proposalsConfig = councilConfigs[chainId].coreVoting.proposals;
  const gscProposalsConfig = councilConfigs[chainId].gscVoting?.proposals;
  return useQuery({
    queryKey: ["proposalsPage", account],
    queryFn: async () => {
      let allProposals = await coreVoting.getProposals();

      if (gscVoting) {
        const gscProposals = await gscVoting.getProposals();
        allProposals = [...allProposals, ...gscProposals];
      }

      return await Promise.all(
        allProposals.map(async (proposal) => {
          let proposalConfig: ProposalConfig | undefined;
          if (proposal.votingContract.address === gscVoting?.address) {
            proposalConfig = gscProposalsConfig?.[proposal.id];
          } else {
            proposalConfig = proposalsConfig[proposal.id];
          }

          const createdBlock = await proposal.getCreatedBlock();
          const expirationBlock = await proposal.getExpirationBlock();
          const votingEnds = expirationBlock
            ? await getBlockDate(expirationBlock, context.provider, {
                estimateFutureDates: true,
              })
            : null;
          const lastCall = await proposal.getLastCallBlock();
          const lastCallDate = lastCall
            ? await getBlockDate(lastCall, context.provider, {
                estimateFutureDates: true,
              })
            : null;
          const currentQuorum = await proposal.getCurrentQuorum();
          const vote = account ? await proposal.getVote(account) : null;
          return {
            status: getProposalStatus({
              isExecuted: await proposal.getIsExecuted(),
              currentQuorum,
              lastCallDate,
              requiredQuorum: await proposal.getRequiredQuorum(),
              results: await proposal.getResults(),
            }),
            votingContractAddress: proposal.votingContract.address,
            votingContractName: proposal.votingContract.name,
            id: proposal.id,
            created:
              createdBlock &&
              (await getBlockDate(createdBlock, context.provider)),
            votingEnds,
            currentQuorum,
            ballot: vote && parseEther(vote.power).gt(0) ? vote.ballot : null,
            sentenceSummary: proposalConfig?.sentenceSummary,
            title: proposalConfig?.title,
          };
        }),
      );
    },
  });
}
