import { ReactElement, ReactNode } from "react";

interface StatProps {
  label: ReactNode;
  value: ReactNode;

  // TODO: Add `labelTooltip: string` if we ever need it
}

export function Stat({ label, value }: StatProps): ReactElement {
  return (
    <div className="daisy-stats">
      <div className="daisy-stat bg-base-200">
        <div className="daisy-stat-title">{label}</div>
        <div className="text-sm daisy-stat-value">{value}</div>
      </div>
    </div>
  );
}
