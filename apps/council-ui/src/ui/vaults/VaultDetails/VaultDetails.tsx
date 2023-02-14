import { ReactElement, ReactNode } from "react";

interface VaultDetailsProps {
  header: ReactNode;
  statsRow: ReactNode;
  paragraphSummary?: string;
  actions: ReactNode;
}

export function VaultDetails({
  actions,
  paragraphSummary,
  header,
  statsRow,
}: VaultDetailsProps): ReactElement {
  return (
    <>
      {header}
      {statsRow}
      {paragraphSummary && <p className="mb-1 text-lg">{paragraphSummary}</p>}
      <div className="flex flex-col w-full gap-8 sm:flex-row">{actions}</div>
    </>
  );
}
