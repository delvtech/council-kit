import { FixedNumber } from "ethers";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";

interface QuorumBarProps {
  current: string;
  required: string;
}

export function QuorumBar({ current, required }: QuorumBarProps): ReactElement {
  const percentage = FixedNumber.from(current)
    .divUnsafe(FixedNumber.from(required))
    .mulUnsafe(FixedNumber.from(100))
    .round();

  return (
    <div>
      <div className="flex ">
        <h3 className="mr-6 font-medium">QUORUM</h3>
        <p className="ml-auto font-bold">{percentage.toString()} %</p>
      </div>
      <progress
        className="w-full daisy-progress daisy-progress-info bg-neutral"
        value={current}
        max={required}
      />
      <div className="flex flex-row-reverse gap-x-1">
        <p className="font-bold"> {formatBalance(required)}</p>
        <span>/</span>
        <p>{formatBalance(current)}</p>
      </div>
    </div>
  );
}

// ================ Skeletons ================

export function QuorumBarSkeleton(): ReactElement {
  return (
    <div>
      <div className="flex ">
        <h3 className="w-24 mr-6 font-medium">QUORUM</h3>
      </div>
      <Skeleton />
    </div>
  );
}
