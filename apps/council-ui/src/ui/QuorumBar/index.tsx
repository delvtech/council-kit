import { ReactElement } from "react";
import { formatBalance } from "src/ui/utils/formatBalance";

interface QuorumBarProps {
  current: string;
  required: string;
}

export default function QuorumBar({
  current,
  required,
}: QuorumBarProps): ReactElement {
  return (
    <div>
      <div className="flex w-full">
        <h3>QUORUM</h3>
        <p className="ml-auto font-bold">
          {formatBalance(current)} / {formatBalance(required)}
        </p>
      </div>
      <progress
        className="daisy-progress daisy-progress-info w-48 bg-neutral sm:w-64"
        value={current.toString()}
        max={required.toString()}
      ></progress>
    </div>
  );
}
