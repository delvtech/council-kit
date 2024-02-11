import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { useTokenSymbol } from "src/ui/token/hooks/useTokenSymbol";
import { useAirdropToken } from "./hooks/useAirdropToken";
import { useClaimableAirdropAmount } from "./hooks/useClaimableAirdropAmount";

interface ConfirmClaimStepProps {
  recipient: string | undefined;
  onBack: () => void;
  onConfirm: (() => void) | undefined;
}

export default function ConfirmClaimStep({
  recipient,
  onBack,
  onConfirm,
}: ConfirmClaimStepProps): ReactElement {
  const { claimableAmountFormatted } = useClaimableAirdropAmount();
  const { airdropToken } = useAirdropToken();
  const { symbol } = useTokenSymbol(airdropToken?.address);
  const displayName = useDisplayName(recipient);

  return (
    <>
      <div className="daisy-stats daisy-stats-vertical">
        <div className="daisy-stat bg-base-200">
          <div className="daisy-stat-title">Send</div>
          <div className="daisy-stat-value">
            {claimableAmountFormatted && symbol ? (
              `${formatBalance(claimableAmountFormatted, 4)} ${symbol}`
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
      <div className="flex justify-center gap-2 sm:gap-4">
        <button className="daisy-btn grow gap-2" onClick={onBack}>
          <ArrowLeftIcon className="h-4 w-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary grow gap-2"
          disabled={!onConfirm}
          onClick={onConfirm}
        >
          <CheckIcon className="h-4 w-4 fill-current" />
          Confirm
        </button>
      </div>
    </>
  );
}
