import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";
import { GridTableRow } from "src/ui/base/tables/GridTableRow";

export function ProposalsTableSkeleton(): ReactElement {
  return (
    <div className="min-w-[250px]">
      <GridTableHeader className="grid-cols-[4fr_1fr_1fr_1fr_56px]">
        <span>Name</span>
        <span>Voting Ends</span>
        <span>Status</span>
        <span>Your Ballot</span>
        <span className="col-span-1"></span>
      </GridTableHeader>

      {new Array(4).fill(null).map((_, i) => (
        <GridTableRow key={i} className="grid-cols-[4fr_1fr_1fr_1fr_56px]">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <span>
            <ChevronRightIcon className="w-6 h-6 stroke-base-content opacity-40" />
          </span>
        </GridTableRow>
      ))}
    </div>
  );
}
