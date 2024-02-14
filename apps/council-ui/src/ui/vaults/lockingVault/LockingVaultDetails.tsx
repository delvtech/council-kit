import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { useVaultConfig } from "src/ui/config/hooks/useVaultConfig";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

import { ChangeDelegateForm } from "src/ui/vaults/ChangeDelegateForm";
import { DepositAndWithdrawForm } from "src/ui/vaults/DepositAndWithdrawForm";
import { useApprove } from "src/ui/vaults/lockingVault/hooks/useApprove";
import { useChangeDelegate } from "src/ui/vaults/lockingVault/hooks/useChangeDelegate";
import { useDeposit } from "src/ui/vaults/lockingVault/hooks/useDeposit";
import { useWithdraw } from "src/ui/vaults/lockingVault/hooks/useWithdraw";
import { LockingVaultStatsRow } from "src/ui/vaults/lockingVault/LockingVaultStatsRow";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { isAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";

interface LockingVaultDetailsProps {
  address: `0x${string}`;
}

export function LockingVaultDetails({
  address,
}: LockingVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const chainId = useSupportedChainId();
  const { data, status, error } = useLockingVaultDetailsData(address, account);
  const publicClient = usePublicClient();

  const { changeDelegate, status: changeDelegateStatus } = useChangeDelegate();
  const { deposit, status: depositStatus } = useDeposit();
  const { withdraw, status: withdrawStatus } = useWithdraw();
  const { approve, status: approveStatus } = useApprove();

  const isTransacting = [
    changeDelegateStatus,
    depositStatus,
    withdrawStatus,
    approveStatus,
  ].some((status) => status === "pending");

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }
  if (status !== "success") {
    return <VaultDetailsSkeleton />;
  }

  async function handleDelegate(delegate: string): Promise<void> {
    let delegateAddress: string | null | undefined = delegate;
    if (!isAddress(delegate)) {
      delegateAddress = await publicClient?.getEnsAddress({ name: delegate });
    }
    if (!delegateAddress) {
      makeTransactionErrorToast(
        `Could not find address for ${delegate}`,
        undefined,
        chainId,
      );
      return;
    }
    return changeDelegate?.({
      newDelegate: delegateAddress as `0x${string}`,
      vaultAddress: address,
    });
  }

  return (
    <VaultDetails
      name={data.name}
      paragraphSummary={data.paragraphSummary}
      header={
        <VaultHeader name={data.name} descriptionURL={data.descriptionURL} />
      }
      statsRow={
        <LockingVaultStatsRow
          accountVotingPower={data.accountVotingPower}
          delegatedToAccount={data.delegatedToAccount}
          participants={data.participants}
          tokenAddress={data.tokenAddress}
          tokenSymbol={data.tokenSymbol}
          decimals={data.decimals}
        />
      }
      actions={
        <>
          <DepositAndWithdrawForm
            symbol={data.tokenSymbol}
            balance={data.tokenBalance}
            allowance={data.tokenAllowance}
            depositedBalance={data.depositedBalance}
            disabled={
              !account || !deposit || !withdraw || !approve || isTransacting
            }
            onApprove={() => approve?.(address)}
            onDeposit={(amount) =>
              deposit?.({
                amount,
                vaultAddress: address,
              })
            }
            onWithdraw={(amount) =>
              withdraw?.({
                amount,
                vaultAddress: address,
              })
            }
            decimals={data.decimals}
          />

          <ChangeDelegateForm
            currentDelegate={data.delegate}
            onDelegate={handleDelegate}
            disabled={!account || !data.depositedBalance || isTransacting}
          />
        </>
      }
    />
  );
}

interface LockingVaultDetailsData {
  accountVotingPower: bigint;
  delegate?: `0x${string}`;
  delegatedToAccount: number;
  depositedBalance: bigint;
  descriptionURL: string | undefined;
  paragraphSummary: string | undefined;
  name: string | undefined;
  participants: number;
  tokenAddress: `0x${string}`;
  tokenAllowance: bigint;
  tokenBalance: bigint;
  tokenSymbol: string;
  decimals: number;
}

function useLockingVaultDetailsData(
  address: `0x${string}`,
  account: `0x${string}` | undefined,
): UseQueryResult<LockingVaultDetailsData> {
  const council = useReadCouncil();
  const vaultConfig = useVaultConfig(address);

  return useQuery({
    queryKey: ["lockingVaultDetails", address, account, vaultConfig],
    queryFn: async (): Promise<LockingVaultDetailsData> => {
      const lockingVault = council.lockingVault(address);
      const token = await lockingVault.getToken();
      const delegate = account
        ? await lockingVault.getDelegate({ account })
        : undefined;
      const accountVotingPower = account
        ? await lockingVault.getVotingPower({ account })
        : 0n;

      return {
        accountVotingPower,

        tokenAddress: token.address,
        tokenSymbol: await token.getSymbol(),
        tokenBalance: account ? await token.getBalanceOf({ account }) : 0n,
        tokenAllowance: account
          ? await token.getAllowance({
              owner: account,
              spender: address,
            })
          : 0n,
        depositedBalance: account
          ? await lockingVault.getDepositedBalance({ account })
          : 0n,

        delegate: delegate?.address,
        descriptionURL: vaultConfig?.descriptionURL,
        paragraphSummary: vaultConfig?.paragraphSummary,
        name: vaultConfig?.name,
        participants: (await lockingVault.getVoters()).length,
        delegatedToAccount: account
          ? (await lockingVault.getDelegatorsTo({ account })).length
          : 0,
        decimals: await token.getDecimals(),
      };
    },
  });
}
