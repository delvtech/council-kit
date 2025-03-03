import { ProposalStatus } from "@delvtech/council-js";
import classNames from "classnames";
import { ReactElement } from "react";
import { Tooltip } from "src/ui/base/Tooltip";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
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
                "daisy-badge-error": status === "failed",
                "daisy-badge-info": status === "active",
                "daisy-badge-success": status === "executed",
                "daisy-badge-warning": status === "expired",
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

      {status === "executed" ? (
        <p className="text-right font-bold uppercase">Quorum met</p>
      ) : required ? (
        <div className="flex justify-between gap-x-1">
          <h3 className="mr-6 font-medium uppercase">Quorum</h3>
          <span>
            {formatVotingPower(current, 0)} /
            <span className="font-bold"> {formatVotingPower(required, 0)}</span>
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
  if (status === "executed") {
    return (
      <progress
        className="daisy-progress daisy-progress-success w-full"
        value={100}
        max={100}
      />
    );
  }

  if (!requiredQuorum || status === "unknown") {
    return <progress className="daisy-progress w-full" value={0} max={100} />;
  }

  return (
    <progress
      className={classNames("daisy-progress w-full", {
        "daisy-progress-info": status === "active",
        "daisy-progress-error": status === "failed",
        "daisy-progress-warning": status === "expired",
      })}
      value={String(currentQuorum)}
      max={String(requiredQuorum)}
    />
  );
}
