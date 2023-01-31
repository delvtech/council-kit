import { getBlockDate } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { parseEther } from "ethers/lib/utils";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import {
  ProposalRowData,
  ProposalsTable,
} from "src/ui/proposals/ProposalsTable";
import { ProposalsTableSkeleton } from "src/ui/proposals/ProposalsTableSkeleton";
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
          header="Check out our docs to learn more about the proposal process."
          body="Click to dive deeper into proposals in Council. "
          href="#"
        />
        <ExternalInfoCard
          header="Learn to create your own on-chain proposals"
          body="Proposals are necessary for any critical governance actions to be executed."
          href="#"
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
          const createdBlock = await proposal.getCreatedBlock();
          const expirationBlock = await proposal.getExpirationBlock();
          const vote = account ? await proposal.getVote(account) : null;
          return {
            votingContractAddress: proposal.votingContract.address,
            votingContractName: proposal.votingContract.name,
            id: proposal.id,
            created:
              createdBlock &&
              (await getBlockDate(createdBlock, context.provider)),
            votingEnds:
              expirationBlock &&
              (await getBlockDate(expirationBlock, context.provider, {
                estimateFutureDates: true,
              })),
            currentQuorum: await proposal.getCurrentQuorum(),
            requiredQuorum: await proposal.getRequiredQuorum(),
            ballot: vote && parseEther(vote.power).gt(0) ? vote.ballot : null,
            sentenceSummary: proposalsConfig[proposal.id]?.sentenceSummary,
          };
        }),
      );
    },
  });
}
