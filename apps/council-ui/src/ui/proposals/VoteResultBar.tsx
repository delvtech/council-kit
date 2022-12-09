import { formatEther } from "ethers/lib/utils";
import { ReactElement } from "react";

interface VoteResultBarProps {
  yesResults: string;
  noResults: string;
  maybeResults: string;
}

export function VoteResultBar({
  yesResults,
  noResults,
  maybeResults,
}: VoteResultBarProps): ReactElement {
  const resultsTotal =
    +formatEther(yesResults) +
    +formatEther(noResults) +
    +formatEther(maybeResults);

  if (!resultsTotal) {
    return <div>Unknown</div>;
  }

  const yesPercent = (+formatEther(yesResults) / resultsTotal) * 100;
  const maybePercent = (+formatEther(maybeResults) / resultsTotal) * 100;

  return (
    <svg height="10" width="100%">
      <line
        x1="0"
        y1="0"
        x2={`${yesPercent}%`}
        y2="0"
        className="stroke-success"
        strokeWidth={12}
      />
      <line
        x1={`${yesPercent}%`}
        y1="0"
        x2={`${yesPercent + maybePercent}%`}
        y2="0"
        className="stroke-neutral-focus"
        strokeWidth={12}
      />
      <line
        x1={`${yesPercent + maybePercent}%`}
        y1="0"
        x2="100%"
        y2="0"
        className="stroke-error"
        strokeWidth={12}
      />
    </svg>
  );
}
