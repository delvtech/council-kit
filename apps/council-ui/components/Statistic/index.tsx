import { ReactElement } from "react";

interface StatisticProps {
  label: string;
  value: string;
}

function Statistic({ label, value }: StatisticProps): ReactElement {
  return (
    <div className="px-4 py-2 bg-gray-200 rounded-md">
      <div className="text-gray-500">{label}</div>
      <div className="text-black">{value}</div>
    </div>
  );
}

export default Statistic;
