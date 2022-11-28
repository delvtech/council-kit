import assertNever from "assert-never";
import classNames from "classnames";
import { ReactElement, useState } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { NumericInput } from "src/ui/base/forms/NumericInput";

interface DepositAndWithdrawFormProps {
  symbol: string;
  balance: string;
  depositedBalance: string;
  onDeposit: (amount: string) => void;
  onWithdraw: (amount: string) => void;
  disabled?: boolean;
}

export function DepositAndWithdrawForm({
  symbol,
  balance,
  depositedBalance,
  onDeposit,
  onWithdraw,
  disabled = false,
}: DepositAndWithdrawFormProps): ReactElement {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  return (
    <div className="flex basis-1/2 flex-col gap-y-4">
      <div className="flex gap-x-4">
        <button onClick={() => setActiveTab("deposit")}>
          <h2
            className={classNames("text-2xl", {
              "font-extrabold": activeTab === "deposit",
            })}
          >
            Deposit
          </h2>
        </button>
        <button onClick={() => setActiveTab("withdraw")}>
          <h2
            className={classNames("text-2xl", {
              "font-extrabold": activeTab === "withdraw",
            })}
          >
            Withdraw
          </h2>
        </button>
      </div>

      {(() => {
        switch (activeTab) {
          case "deposit":
            return (
              <>
                <NumericInput
                  placeholder="Amount"
                  value={depositAmount}
                  maxButtonValue={balance}
                  onChange={setDepositAmount}
                  infoText={`Balance: ${formatBalance(balance, 4)} ${symbol}`}
                />
                <button
                  className="daisy-btn daisy-btn-primary"
                  onClick={() => onDeposit(depositAmount)}
                  disabled={disabled}
                >
                  Deposit
                </button>
              </>
            );

          case "withdraw":
            return (
              <>
                <NumericInput
                  placeholder="Amount"
                  value={withdrawAmount}
                  maxButtonValue={depositedBalance}
                  onChange={setWithdrawAmount}
                  infoText={`Deposited: ${formatBalance(
                    depositedBalance,
                    4,
                  )} ${symbol}`}
                />
                <button
                  className="daisy-btn daisy-btn-primary"
                  onClick={() => onWithdraw(withdrawAmount)}
                  disabled={disabled}
                >
                  Withdraw
                </button>
              </>
            );

          default:
            assertNever(activeTab);
        }
      })()}
    </div>
  );
}
