import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { GridTableRow } from "src/ui/base/tables/GridTableRow";
import { GSCMembersTableHeader } from "./GSCMembersTableHeader";

export function GSCMembersTableSkeleton(): ReactElement {
  return (
    <div className="w-full overflow-auto max-h-96">
      <GSCMembersTableHeader />

      {new Array(8).fill(null).map((_, i) => (
        <GridTableRow key={i}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </GridTableRow>
      ))}
    </div>
  );
}
