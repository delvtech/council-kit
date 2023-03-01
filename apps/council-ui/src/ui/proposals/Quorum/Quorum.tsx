import classNames from "classnames";
import { ReactElement } from "react";
import { ProposalStatus } from "src/proposals/getProposalStatus";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
import { tooltipByStatus } from "src/ui/proposals/tooltips";

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
          <Tooltip content={tooltipByStatus[status]} className="ml-auto">
            <div
              className={classNames("font-bold daisy-badge", {
                "daisy-badge-error": status === "FAILED",
                "daisy-badge-info": status === "IN PROGRESS",
                "daisy-badge-success": status === "EXECUTED",
                "daisy-badge-warning": status === "EXPIRED",
              })}
            >
              {status}
            </div>
          </Tooltip>
        </div>
      )}

      <QuorumBar
        requiredQuorum={required}
        currentQuorum={current}
        status={status}
      />

      {status === "EXECUTED" ? (
        <p className="font-bold uppercase text-right">Quorum met</p>
      ) : required ? (
        <div className="flex justify-between gap-x-1">
          <h3 className="mr-6 font-medium uppercase">Quorum</h3>
          <span>
            {formatBalance(current, 0)} /
            <span className="font-bold"> {formatBalance(required, 0)}</span>
          </span>{" "}
        </div>
      ) : null}
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
