import classNames from "classnames";
import { ReactElement } from "react";

interface MiniQuorumBarProps {
  currentQuorum: string;
  requiredQuorum: string | null;
  votingEnds: Date | null;
}

export function MiniQuorumBar({
  currentQuorum,
  requiredQuorum,
  votingEnds,
}: MiniQuorumBarProps): ReactElement {
  const currentDate = new Date();

  if (!requiredQuorum) {
    return <progress className="w-full daisy-progress" value={0} max={100} />;
  }

  const hasPassedQuorum = +currentQuorum >= +requiredQuorum;

  if (votingEnds && currentDate > votingEnds && !hasPassedQuorum) {
    return (
      <progress
        className="w-full daisy-progress daisy-progress-error"
        value={currentQuorum}
        max={requiredQuorum}
      />
    );
  }

  return (
    <progress
      className={classNames("w-full daisy-progress daisy-progress-info", {
        "daisy-progress-success": hasPassedQuorum,
      })}
      value={currentQuorum}
      max={requiredQuorum}
    />
  );
}
