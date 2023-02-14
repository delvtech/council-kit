import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";

export function VaultDetailsSkeleton(): ReactElement {
  return (
    <VaultDetails
      header={
        <div className="w-80">
          <Skeleton className="h-12" />
        </div>
      }
      statsRow={<Skeleton count={4} className="mb-5" />}
      actions={
        <Skeleton count={1} containerClassName="w-full" className="h-80" />
      }
    />
  );
}
