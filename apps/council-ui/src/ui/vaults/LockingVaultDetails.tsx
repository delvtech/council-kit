import { LockingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { ReactElement } from "react";
import { Progress } from "src/ui/base/Progress";
import { useCouncil } from "src/ui/council/useCouncil";
import { ChangeDelegateForm } from "./base/ChangeDelegateForm";
import { DepositAndWithdrawForm } from "./base/DepositAndWithdrawForm";

interface LockingVaultDetailsProps {
  address: string;
  account: string;
}

export function LockingVaultDetails({
  address,
  account,
}: LockingVaultDetailsProps): ReactElement {
  const { data, status, error } = useLockingVaultDetailsData(address, account);

  switch (status) {
    case "loading":
      return (
        <div className="flex flex-col items-center gap-8 ">
          <Progress />
        </div>
      );

    case "error":
      return (
        <div className="daisy-mockup-code">
          <code className="block whitespace-pre-wrap px-6 text-error">
            {error ? (error as any).toString() : "Unknown error"}
          </code>
        </div>
      );

    case "success":
      return (
        <div className="flex h-48 w-full flex-col gap-x-8 sm:flex-row">
          <DepositAndWithdrawForm
            symbol={data.tokenSymbol}
            balance={data.tokenBalance}
            depositedBalance={data.depositedBalance}
            onDeposit={() => {}} // TODO
            onWithdraw={() => {}} // TODO
          />
          <ChangeDelegateForm
            currentDelegate={data.delegate}
            onDelegate={() => {}} // TODO
          />
        </div>
      );

    default:
      assertNever(status);
  }
}

interface LockingVaultDetailsData {
  tokenSymbol: string;
  tokenBalance: string;
  depositedBalance: string;
  delegate: string;
}

function useLockingVaultDetailsData(
  address: string,
  account: string,
): UseQueryResult<LockingVaultDetailsData> {
  const { context } = useCouncil();
  return useQuery(["lockingVaultDetails", address], async () => {
    const lockingVault = new LockingVault(address, context);
    const token = await lockingVault.getToken();
    const delegate = await lockingVault.getDelegate(account);
    return {
      tokenSymbol: await token.getSymbol(),
      tokenBalance: await token.getBalanceOf(account),
      depositedBalance: await lockingVault.getDepositedBalance(account),
      delegate: delegate.address,
    };
  });
}
