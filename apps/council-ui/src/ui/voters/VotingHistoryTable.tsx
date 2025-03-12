import { Vote } from "@delvtech/council-js";
import { ReactElement } from "react";
import { VotingContractConfig } from "src/config/types";
import { getProposalConfig } from "src/config/utils/getProposalConfig";
import { makeProposalURL } from "src/routes";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";
import { GridTableRowLink } from "src/ui/base/tables/GridTableRowLink";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import FormattedBallot from "src/ui/voting/FormattedBallot";

interface VotingHistoryTableProps {
  votingContract: VotingContractConfig;
  votes: Vote[];
}

export function VotingHistoryTable({
  votingContract,
  votes,
}: VotingHistoryTableProps): ReactElement {
  if (votes.length === 0) {
    return <h2 className="text-lg">No voting history for this account.</h2>;
  }

  return (
    <div>
      <GridTableHeader className="grid-cols-[3fr_1fr_1fr]">
        <span>Proposal</span>
        <span>Voting Power</span>
        <span>Vote</span>
      </GridTableHeader>
      {votes.map((vote, i) => (
        <VoteHistoryRow key={i} votingContract={votingContract} vote={vote} />
      ))}
    </div>
  );
}

function VoteHistoryRow({
  votingContract,
  vote,
}: {
  votingContract: VotingContractConfig;
  vote: Vote;
}): ReactElement {
  const chainId = useSupportedChainId();
  const proposalConfig = getProposalConfig({
    chainId,
    votingContract: votingContract.address,
    id: vote.proposalId,
  });
  const sentenceSummary = proposalConfig?.sentenceSummary;
  return (
    <GridTableRowLink
      className="grid-cols-[3fr_1fr_1fr]"
      href={makeProposalURL(votingContract.address, vote.proposalId)}
    >
      <span>
        {votingContract.name} Proposal {String(vote.proposalId)}
        {sentenceSummary && (
          <p className="text-sm opacity-60">
            {sentenceSummary.length > 80
              ? `${sentenceSummary.slice(0, 80)}\u2026` // unicode for horizontal ellipses
              : sentenceSummary}
          </p>
        )}
      </span>
      <span>{formatVotingPower(vote.votingPower)}</span>
      <span>
        <FormattedBallot ballot={vote.ballot} />
      </span>
    </GridTableRowLink>
  );
}
