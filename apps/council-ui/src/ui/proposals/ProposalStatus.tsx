import classNames from "classnames";
import { ReactElement } from "react";
import { useProposalStatus } from "./hooks/useProposalStatus";

interface ProposalStatusProps {
  currentQuorum: string;
  requiredQuorum: string | null;
  votingEnds: Date | null;
  proposalId: number;
}
export function ProposalStatus({
  currentQuorum,
  requiredQuorum,
  votingEnds,
  proposalId,
}: ProposalStatusProps): ReactElement | null {
  const { data: proposalStatus, status } = useProposalStatus(
    currentQuorum,
    requiredQuorum,
    votingEnds,
    proposalId,
  );

  if (status === "loading") {
    return null;
  }

  if (status === "error") {
    return <div className="font-bold daisy-badge">Unknown</div>;
  }

  return (
    <div
      className={classNames("font-bold daisy-badge", {
        "daisy-badge-error": proposalStatus === "FAILED",
        "daisy-badge-info": proposalStatus === "IN PROGRESS",
        "daisy-badge-success": proposalStatus === "EXECUTED",
        "daisy-badge-warning": proposalStatus === "EXPIRED",
      })}
    >
      {proposalStatus}
    </div>
  );
}
