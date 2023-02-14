import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";

export function VaultDetailsSkeleton(): ReactElement {
  return (
    <>
      <div className="w-80">
        <Skeleton className="h-12" />
      </div>

      <Skeleton count={4} className="mb-5" />
      <Skeleton count={1} className="h-80" />
    </>
  );
}
