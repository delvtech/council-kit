import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";
import { GridTableRow } from "src/ui/base/tables/GridTableRow";

export function VoterListSkeleton(): ReactElement {
  return (
    <div className="min-w-[250px]">
      <GridTableHeader className="grid-cols-[5fr_2fr_56px]">
        <span>Voter</span>
        <span>Voting Power</span>
        <span className="col-span-1"></span>
      </GridTableHeader>

      {new Array(8).fill(null).map((_, i) => (
        <GridTableRow key={i} className="grid-cols-[5fr_2fr_56px]">
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
