import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { getVaultConfig } from "src/config/utils/getVaultConfig";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";
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

  const { write: changeDelegate } = useChangeDelegate();

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
  const chainId = useSupportedChainId();
  const vaultConfig = getVaultConfig({ address, chainId });
  const council = useReadCouncil();
  const enabled = !!council && !!vaultConfig;

  return useQuery({
    queryKey: [
      "frozenLockingVaultDetails",
      vaultConfig?.chainId,
      address,
      account,
    ],
    enabled,
    queryFn: enabled
      ? async () => {
          const lockingVault = council.lockingVault(address);

          const [token, voters, accountVotingPower, delegate, delegators] =
            await Promise.all([
              lockingVault.getToken(),
              lockingVault.getVoters(),
              account ? lockingVault.getVotingPower({ voter: account }) : 0n,
              account ? lockingVault.getDelegate(account) : undefined,
              account ? lockingVault.getDelegatorsTo(account) : [],
            ]);

          const [tokenSymbol, tokenBalance, tokenAllowance, depositedBalance] =
            await Promise.all([
              token.getSymbol(),
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
            name: vaultConfig?.name,
            descriptionURL: vaultConfig?.descriptionURL,
            paragraphSummary: vaultConfig?.paragraphSummary,
            participants: voters.length,
            accountVotingPower,
            delegate,
            delegatedToAccount: delegators.length,
            tokenAddress: token.address,
            tokenSymbol,
            tokenBalance,
            tokenAllowance,
            depositedBalance,
          };
        }
      : undefined,
  });
}
