import { ReactElement, ReactNode } from "react";
import { Routes } from "src/routes";
import { Breadcrumbs } from "src/ui/base/Breadcrumbs";

interface VaultDetailsProps {
  name: string | undefined;
  header: ReactNode;
  statsRow: ReactNode;
  paragraphSummary?: string;
  actions?: ReactNode;
}

export function VaultDetails({
  name,
  actions,
  paragraphSummary,
  header,
  statsRow,
}: VaultDetailsProps): ReactElement {
  return (
    <>
      <div className="space-y-2">
        <Breadcrumbs
          crumbs={[{ href: Routes.VAULTS, content: "All vaults" }]}
          currentPage={name}
        />
        {header}
      </div>

      {statsRow}

      {paragraphSummary && <p className="mb-1 text-lg">{paragraphSummary}</p>}

      {actions && (
        <div className="flex flex-col w-full gap-8 sm:flex-row">{actions}</div>
      )}
    </>
  );
}
