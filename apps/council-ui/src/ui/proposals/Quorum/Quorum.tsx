import classNames from "classnames";
import { ReactElement } from "react";
import { ProposalStatus } from "src/proposals/getProposalStatus";
import { formatBalance } from "src/ui/base/formatting/formatBalance";

interface QuorumProps {
  current: string;
  required: string | null;
  status: ProposalStatus;
}

export function Quorum({
  current,
  required,
  status,
}: QuorumProps): ReactElement {
  return (
    <div>
      {status && (
        <div className="flex">
          <h3 className="mr-6 font-medium">QUORUM</h3>
          <div className="ml-auto font-bold daisy-badge">{status}</div>
        </div>
      )}

      <QuorumBar
        requiredQuorum={required}
        currentQuorum={current}
        status={status}
      />

      {required && (
        <div className="flex justify-end gap-x-1">
          <p>{formatBalance(current, 0)}</p>
          <span>/</span>
          <p className="font-bold"> {formatBalance(required, 0)}</p>
        </div>
      )}
    </div>
  );
}

interface QuorumBarProps {
  currentQuorum: string;
  requiredQuorum: string | null;
  status: ProposalStatus | undefined;
}

function QuorumBar({
  currentQuorum,
  requiredQuorum,
  status,
}: QuorumBarProps): ReactElement {
  if (status === "EXECUTED") {
    return (
      <progress
        className="w-full daisy-progress daisy-progress-success"
        value={100}
        max={100}
      />
    );
  }

  if (!requiredQuorum || status === "UNKNOWN") {
    return <progress className="w-full daisy-progress" value={0} max={100} />;
  }

  return (
    <progress
      className={classNames("w-full daisy-progress", {
        "daisy-progress-info": status === "IN PROGRESS",
        "daisy-progress-error": status === "FAILED",
        "daisy-progress-warning": status === "EXPIRED",
      })}
      value={currentQuorum}
      max={requiredQuorum}
    />
  );
}
