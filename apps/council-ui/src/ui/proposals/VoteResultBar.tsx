import { sumStrings, VoteResults } from "@council/sdk";
import { formatUnits, parseEther } from "ethers/lib/utils";
import { ReactElement } from "react";

interface VoteResultBarProps {
  results: VoteResults;
}

export function VoteResultBar({ results }: VoteResultBarProps): ReactElement {
  const yesResult = results.yes;
  const noResult = results.no;
  const maybeResult = results.maybe;
  const resultsTotal = parseEther(
    sumStrings([yesResult, noResult, maybeResult]),
  );

  if (resultsTotal) {
    return <div>Unknown</div>;
  }

  const yesPercent =
    +formatUnits(parseEther(yesResult).div(resultsTotal), 0) * 100;
  const maybePercent =
    +formatUnits(parseEther(maybeResult).div(resultsTotal), 0) * 100;

  return (
    <svg height="10" width="100%">
      <line
        x1="0"
        y1="0"
        x2={`${yesPercent}%`}
        y2="0"
        className="stroke-green-500"
        strokeWidth={10}
      />
      <line
        x1={`${yesPercent}%`}
        y1="0"
        x2={`${yesPercent + maybePercent}%`}
        y2="0"
        className="stroke-neutral"
        strokeWidth={10}
      />
      <line
        x1={`${yesPercent + maybePercent}%`}
        y1="0"
        x2="100%"
        y2="0"
        className="stroke-red-500"
        strokeWidth={10}
      />
    </svg>
  );
}
