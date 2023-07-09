import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { useTokenSymbol } from "src/ui/token/hooks/useTokenSymbol";
import { useAirdropToken } from "./hooks/useAirdropToken";
import { useClaimableAirdropAmount } from "./hooks/useClaimableAirdropAmount";

interface ConfirmClaimStepProps {
  recipient: string;
  onBack: () => void;
  onConfirm: (() => void) | undefined;
}

export default function ConfirmClaimStep({
  recipient,
  onBack,
  onConfirm,
}: ConfirmClaimStepProps): ReactElement {
  const { data: claimableAmount } = useClaimableAirdropAmount();
  const { data: token } = useAirdropToken();
  const { data: symbol } = useTokenSymbol(token?.address);

  const displayName = useDisplayName(recipient);
  return (
    <>
      <div className="daisy-stats daisy-stats-vertical">
        <div className="daisy-stat bg-base-200">
          <div className="daisy-stat-title">Send</div>
          <div className="daisy-stat-value">
            {claimableAmount && symbol ? (
              `${formatBalance(claimableAmount, 4)} ${symbol}`
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <div className="daisy-stat bg-base-200">
          <div className="daisy-stat-title">To</div>
          <div className=" daisy-stat-value">{displayName}</div>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button className="daisy-btn gap-2 grow" onClick={onBack}>
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary gap-2 grow"
          disabled={!onConfirm}
          onClick={onConfirm}
        >
          <CheckIcon className="w-4 h-4 fill-current" />
          Confirm
        </button>
      </div>
    </>
  );
}
