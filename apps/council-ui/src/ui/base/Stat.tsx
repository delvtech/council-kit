import { ReactElement, ReactNode } from "react";

interface StatProps {
  label?: ReactNode;
  value: ReactNode;
}

export function Stat({ label, value }: StatProps): ReactElement {
  return (
    <div className="daisy-stats">
      <div className="daisy-stat bg-base-200">
        {label && <div className="daisy-stat-title">{label}</div>}
        <div className="daisy-stat-value text-sm">{value}</div>
      </div>
    </div>
  );
}
