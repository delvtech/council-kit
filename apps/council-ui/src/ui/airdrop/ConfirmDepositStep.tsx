import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { useTokenSymbol } from "src/ui/token/hooks/useTokenSymbol";
import { useAirdropToken } from "./hooks/useAirdropToken";
import { useClaimableAirdropAmount } from "./hooks/useClaimableAirdropAmount";

interface ConfirmDepositStepProps {
  account: `0x${string}` | undefined;
  delegate?: `0x${string}`;
  onBack: () => void;
  onConfirm: (() => void) | undefined;
}

export default function ConfirmDepositStep({
  account,
  delegate,
  onBack,
  onConfirm,
}: ConfirmDepositStepProps): ReactElement {
  const { claimableAmountFormatted } = useClaimableAirdropAmount();
  const { airdropToken } = useAirdropToken();
  const { symbol } = useTokenSymbol(airdropToken);

  const displayName = useDisplayName(account);
  const delegateDisplayName = useDisplayName(delegate);

  return (
    <>
      <div className="daisy-stats daisy-stats-vertical">
        <div className="daisy-stat bg-base-200">
          <div className="daisy-stat-title">Deposit</div>
          <div className="daisy-stat-value">
            {claimableAmountFormatted && symbol ? (
              `${formatBalance(claimableAmountFormatted, 4)} ${symbol}`
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <div className="daisy-stat bg-base-200">
          <div className="daisy-stat-title">Credited To</div>
          <div className=" daisy-stat-value">{displayName}</div>
        </div>
        {delegate && (
          <div className="daisy-stat bg-base-200">
            <div className="daisy-stat-title">Voting power delegated to</div>
            <div className=" daisy-stat-value">{delegateDisplayName}</div>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-2 sm:gap-4">
        <button className="daisy-btn grow gap-2" onClick={onBack}>
          <ArrowLeftIcon className="size-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary grow gap-2"
          disabled={!onConfirm}
          onClick={onConfirm}
        >
          <CheckIcon className="size-4 fill-current" />
          Confirm
        </button>
      </div>
    </>
  );
}
