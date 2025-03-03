import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadWriteCouncil } from "src/ui/sdk/useReadWriteCouncil";
import { ChangeDelegateForm } from "src/ui/vaults/ChangeDelegateForm";
import { useChangeDelegate } from "src/ui/vaults/lockingVault/hooks/useChangeDelegate";
import { LockingVaultStatsRow } from "src/ui/vaults/lockingVault/LockingVaultStatsRow";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";

interface LockingVaultDetailsProps {
  address: `0x${string}`;
}

export function FrozenLockingVaultDetails({
  address,
}: LockingVaultDetailsProps): ReactElement {
  const { data, status, error } = useFrozenLockingVaultDetailsData(address);

  const { changeDelegate } = useChangeDelegate();

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  if (status !== "success") {
    return <VaultDetailsSkeleton />;
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
        />
      }
      actions={
        <ChangeDelegateForm
          currentDelegate={data.delegate || zeroAddress}
          disabled={!changeDelegate}
          onDelegate={(newDelegate) =>
            changeDelegate?.({
              vaultAddress: address,
              newDelegate,
            })
          }
        />
      }
    />
  );
}

interface LockingVaultDetailsData {
  accountVotingPower: bigint;
  activeProposalCount: number;
  delegate?: `0x${string}`;
  delegatedToAccount: number;
  depositedBalance: bigint;
  paragraphSummary: string | undefined;
  descriptionURL: string | undefined;
  name: string | undefined;
  participants: number;
  tokenAddress: `0x${string}`;
  tokenAllowance: bigint;
  tokenBalance: bigint;
  tokenSymbol: string;
}

function useFrozenLockingVaultDetailsData(
  address: `0x${string}`,
): UseQueryResult<LockingVaultDetailsData> {
  const { address: account } = useAccount();
  const council = useReadWriteCouncil();
  const config = useCouncilConfig();
  const enabled = !!council;

  return useQuery({
    queryKey: ["frozenLockingVaultDetails", config.chainId, address, account],
    enabled,
    queryFn: enabled
      ? async () => {
          const lockingVault = council.lockingVault(address);
          const token = await lockingVault.getToken();

          const [
            tokenSymbol,
            tokenBalance,
            tokenAllowance,
            depositBalance,
            accountVotingPower,
            delegate,
          ] = await Promise.all([
            token.getSymbol(),
            account ? token.getBalanceOf(account) : undefined,
            account
              ? token.getAllowance({ owner: account, spender: address })
              : 0n,
            account ? lockingVault.getBalanceOf(account) : 0n,
            account
              ? lockingVault.getVotingPower({
                  voter: account,
                })
              : 0n,
            account ? lockingVault.getDelegate(account) : undefined,
          ]);

          return {
            tokenSymbol,
            tokenAddress: token.address,
            accountVotingPower,
            delegate,
            tokenBalance,
            tokenAllowance,
            depositBalance,
            descriptionURL: vaultConfig?.descriptionURL,
            paragraphSummary: vaultConfig?.paragraphSummary,
            name: vaultConfig?.name,
            participants: (await lockingVault.getVoters()).length,
            delegatedToAccount: account
              ? (await lockingVault.getDelegatorsTo({ account })).length
              : 0,
          };
        }
      : undefined,
  });
}
