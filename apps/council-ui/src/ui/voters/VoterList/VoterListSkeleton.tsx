import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";
import { GridTableRow } from "src/ui/base/tables/GridTableRow";

export function VoterListSkeleton(): ReactElement {
  return (
    <div className="min-w-[250px]">
      <GridTableHeader className="grid-cols-[1.5fr_1fr_1fr_56px]">
        <span>Voter</span>
        <span>Voting Power</span>
        <span># of Delegators</span>
        <span className="col-span-1"></span>
      </GridTableHeader>

      {new Array(8).fill(null).map((_, i) => (
        <GridTableRow key={i} className="grid-cols-[1.5fr_1fr_1fr_56px]">
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
