import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";

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
