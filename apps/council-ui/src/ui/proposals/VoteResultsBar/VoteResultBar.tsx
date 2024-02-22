import { VoteResults } from "@delvtech/council-viem";
import { ReactElement } from "react";

export function VoteResultBar({ yes, no, maybe }: VoteResults): ReactElement {
  const resultsTotal = yes + no + maybe;

  if (!resultsTotal) {
    return <div>Unknown</div>;
  }

  const yesPercent = (yes / resultsTotal) * 100n;
  const maybePercent = (maybe / resultsTotal) * 100n;

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
