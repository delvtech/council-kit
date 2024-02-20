import assertNever from "assert-never";
import classNames from "classnames";
import { ReactElement, useState } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { NumericInput } from "src/ui/base/forms/NumericInput";
import { formatUnits, parseUnits } from "viem";

interface DepositAndWithdrawFormProps {
  symbol: string;
  decimals: number;
  balance: bigint;
  allowance: bigint;
  depositedBalance: bigint;
  onApprove: () => void;
  onDeposit: (amount: bigint) => void;
  onWithdraw: (amount: bigint) => void;
  disabled?: boolean;
}

export function DepositAndWithdrawForm({
  symbol,
  decimals,
  balance,
  allowance,
  depositedBalance,
  onApprove,
  onDeposit,
  onWithdraw,
  disabled = false,
}: DepositAndWithdrawFormProps): ReactElement {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const isApproved = allowance >= parseUnits(depositAmount, decimals);
  const balanceFormatted = formatUnits(balance, decimals);
  const depositedBalanceFormatted = formatUnits(depositedBalance, decimals);

  return (
    <div className="daisy-card flex h-fit basis-1/2 flex-col gap-y-4 bg-base-200 p-4">
      <div className="flex gap-x-4">
        <button onClick={() => setActiveTab("deposit")}>
          <h2
            className={classNames("text-2xl hover:underline", {
              "font-extrabold underline": activeTab === "deposit",
            })}
          >
            Deposit
          </h2>
        </button>
        <button onClick={() => setActiveTab("withdraw")}>
          <h2
            className={classNames("text-2xl hover:underline", {
              "font-extrabold underline": activeTab === "withdraw",
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
                  maxButtonValue={balanceFormatted}
                  onChange={setDepositAmount}
                  infoText={
                    <span className="text-lg">
                      Balance:{" "}
                      <span className="text-lg font-bold">
                        {formatBalance(balanceFormatted, 4)} {symbol}
                      </span>
                    </span>
                  }
                  disabled={disabled || !balance}
                />
                {isApproved ? (
                  <button
                    className="daisy-btn daisy-btn-primary"
                    onClick={() =>
                      onDeposit(parseUnits(depositAmount, decimals))
                    }
                    disabled={disabled || !balance || !depositAmount}
                  >
                    Deposit
                  </button>
                ) : (
                  <button
                    className="daisy-btn daisy-btn-primary"
                    onClick={onApprove}
                    disabled={disabled}
                  >
                    Approve
                  </button>
                )}
              </>
            );

          case "withdraw":
            return (
              <>
                <NumericInput
                  placeholder="Amount"
                  value={withdrawAmount}
                  maxButtonValue={depositedBalanceFormatted}
                  onChange={setWithdrawAmount}
                  infoText={
                    <span className="text-lg">
                      Deposited:{" "}
                      <span className="text-lg font-bold">
                        {formatBalance(depositedBalanceFormatted, 4)} {symbol}
                      </span>
                    </span>
                  }
                  disabled={disabled || !depositedBalance}
                />
                <button
                  className="daisy-btn daisy-btn-primary"
                  onClick={() =>
                    onWithdraw(parseUnits(withdrawAmount, decimals))
                  }
                  disabled={disabled || !depositedBalance}
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
