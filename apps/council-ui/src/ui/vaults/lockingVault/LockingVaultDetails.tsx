import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { getVaultConfig } from "src/config/utils/getVaultConfig";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
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
  const { data, status, error } = useLockingVaultDetailsData(address, account);
  const chainId = useSupportedChainId();
  const vaultConfig = getVaultConfig({ address, chainId });
  const name = vaultConfig?.name || "Locking Vault";

  const { write: changeDelegate, status: changeDelegateStatus } =
    useChangeDelegate();
  const { write: deposit, status: depositStatus } = useDeposit();
  const { write: withdraw, status: withdrawStatus } = useWithdraw();
  const { write: approve, status: approveStatus } = useApprove();

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

  const publicClient = usePublicClient();
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
    changeDelegate?.({
      newDelegate: delegateAddress as `0x${string}`,
      vaultAddress: address,
    });
  }

  return (
    <VaultDetails
      name={name}
      paragraphSummary={vaultConfig?.paragraphSummary}
      header={
        <VaultHeader name={name} descriptionURL={vaultConfig?.descriptionURL} />
      }
      statsRow={
        <LockingVaultStatsRow
          accountVotingPower={data.accountVotingPower}
          delegatedToAccount={data.delegatedToAccount}
          participants={data.participants}
          tokenAddress={data.tokenAddress}
          tokenSymbol={data.tokenSymbol}
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
            decimals={data.tokenDecimals}
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
  participants: number;
  tokenAddress: `0x${string}`;
  tokenAllowance: bigint;
  tokenBalance: bigint;
  tokenSymbol: string;
  tokenDecimals: number;
}

function useLockingVaultDetailsData(
  address: `0x${string}`,
  account: `0x${string}` | undefined,
): UseQueryResult<LockingVaultDetailsData> {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const enabled = !!council;

  return useQuery({
    queryKey: ["lockingVaultDetails", address, account],
    enabled,
    queryFn: enabled
      ? async (): Promise<LockingVaultDetailsData> => {
          const lockingVault = council.lockingVault(address);

          const [token, voters, accountVotingPower, delegate, delegators] =
            await Promise.all([
              lockingVault.getToken(),
              lockingVault.getVoters(),
              account ? lockingVault.getVotingPower({ voter: account }) : 0n,
              account ? lockingVault.getDelegate(account) : undefined,
              account ? lockingVault.getDelegatorsTo(account) : [],
            ]);

          const [
            tokenSymbol,
            tokenDecimals,
            tokenBalance,
            tokenAllowance,
            depositedBalance,
          ] = await Promise.all([
            token.getSymbol(),
            token.getDecimals(),
            account ? token.getBalanceOf(account) : 0n,
            account
              ? token.getAllowance({
                  owner: account,
                  spender: address,
                })
              : 0n,
            account ? lockingVault.getBalanceOf(account) : 0n,
          ]);

          return {
            participants: voters.length,
            accountVotingPower,
            delegate,
            delegatedToAccount: delegators.length,
            tokenAddress: token.address,
            tokenSymbol,
            tokenDecimals,
            tokenBalance,
            tokenAllowance,
            depositedBalance,
          };
        }
      : undefined,
  });
}
