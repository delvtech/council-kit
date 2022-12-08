import assertNever from "assert-never";
import classNames from "classnames";
import { parseEther } from "ethers/lib/utils";
import { ReactElement, useState } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { NumericInput } from "src/ui/base/forms/NumericInput";

interface DepositAndWithdrawFormProps {
  symbol: string;
  balance: string;
  allowance: string;
  depositedBalance: string;
  onApprove: () => void;
  onDeposit: (amount: string) => void;
  onWithdraw: (amount: string) => void;
  disabled?: boolean;
}

export function DepositAndWithdrawForm({
  symbol,
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

  const isApproved = parseEther(allowance).gt(parseEther(depositAmount || "0"));

  return (
    <div className="flex basis-1/2 flex-col gap-y-4 daisy-card p-4 bg-base-300 h-fit">
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
                  infoText={
                    <span className="text-lg">
                      Balance:{" "}
                      <span className="text-lg font-bold">
                        {formatBalance(balance, 4)} {symbol}
                      </span>
                    </span>
                  }
                />
                {isApproved ? (
                  <button
                    className="daisy-btn daisy-btn-primary"
                    onClick={() => onDeposit(depositAmount)}
                    disabled={disabled}
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
