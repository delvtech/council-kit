import { Vote } from "@council/sdk";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { makeProposalURL } from "src/routes";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";
import { GridTableRowLink } from "src/ui/base/tables/GridTableRowLink";
import { useChainId } from "src/ui/network/useChainId";
import FormattedBallot from "src/ui/voting/FormattedBallot";

interface VotingHistoryTableProps {
  history: Vote[];
}

export function VotingHistoryTable({
  history,
}: VotingHistoryTableProps): ReactElement {
  if (history.length === 0) {
    return <h2 className="text-lg">No voting history for this account.</h2>;
  }

  return (
    <div>
      <GridTableHeader className="grid-cols-[3fr_1fr_1fr]">
        <span>Proposal</span>
        <span>Voting Power</span>
        <span>Vote</span>
      </GridTableHeader>
      {history.map((vote, i) => (
        <VoteHistoryRow key={i} vote={vote} />
      ))}
    </div>
  );
}

function VoteHistoryRow({ vote }: { vote: Vote }): ReactElement {
  const chainId = useChainId();
  const proposalsConfig = councilConfigs[chainId].coreVoting.proposals;
  const proposal = vote.proposal;
  const votingContract = proposal.votingContract;
  const sentenceSummary = proposalsConfig[proposal.id]?.sentenceSummary;
  return (
    <GridTableRowLink
      className="grid-cols-[3fr_1fr_1fr]"
      href={makeProposalURL(votingContract.address, proposal.id)}
    >
      <span>
        {votingContract.name} Proposal {proposal.id}
        {sentenceSummary && (
          <p className="opacity-60 text-sm">
            {sentenceSummary.length > 80
              ? `${sentenceSummary.slice(0, 80)}\u2026` // unicode for horizontal ellipses
              : sentenceSummary}
          </p>
        )}
      </span>
      <span>{formatBalance(vote.power)}</span>
      <span>
        <FormattedBallot ballot={vote.ballot} />
      </span>
    </GridTableRowLink>
  );
}
