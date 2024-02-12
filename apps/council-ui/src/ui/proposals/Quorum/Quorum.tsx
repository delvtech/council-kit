import classNames from "classnames";
import { ReactElement } from "react";
import { ProposalStatus } from "src/utils/getProposalStatus";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
import { tooltipByStatus } from "src/ui/proposals/tooltips";

interface QuorumProps {
  current: bigint;
  required: bigint | undefined;
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
              className={classNames("daisy-badge font-bold", {
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
        <p className="text-right font-bold uppercase">Quorum met</p>
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
  currentQuorum: bigint;
  requiredQuorum: bigint | undefined;
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
        className="daisy-progress daisy-progress-success w-full"
        value={100}
        max={100}
      />
    );
  }

  if (!requiredQuorum || status === "UNKNOWN") {
    return <progress className="daisy-progress w-full" value={0} max={100} />;
  }

  return (
    <progress
      className={classNames("daisy-progress w-full", {
        "daisy-progress-info": status === "IN PROGRESS",
        "daisy-progress-error": status === "FAILED",
        "daisy-progress-warning": status === "EXPIRED",
      })}
      value={String(currentQuorum)}
      max={String(requiredQuorum)}
    />
  );
}
