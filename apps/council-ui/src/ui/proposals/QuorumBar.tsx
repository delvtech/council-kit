import classNames from "classnames";
import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { getProposalStatus } from "src/ui/proposals/utils/getProposalStatus";

interface QuorumBarProps {
  current: string;
  required: string | null;
  votingEnds: Date | null;
}

export function QuorumBar({
  current,
  required,
  votingEnds,
}: QuorumBarProps): ReactElement {
  const proposalStatus = getProposalStatus(current, required, votingEnds);

  return (
    <div>
      {votingEnds && (
        <div className="flex">
          <h3 className="mr-6 font-medium">QUORUM</h3>
          <div className="ml-auto font-bold daisy-badge">{proposalStatus}</div>
        </div>
      )}
      {required ? (
        <progress
          className={classNames("w-full daisy-progress", {
            "daisy-progress-success":
              proposalStatus === "PASSED" || proposalStatus === "PASSING",
            "daisy-progress-error": proposalStatus === "FAILED",
          })}
          value={current}
          max={required}
        />
      ) : (
        <progress className="w-full daisy-progress" value={0} max={100} />
      )}

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
