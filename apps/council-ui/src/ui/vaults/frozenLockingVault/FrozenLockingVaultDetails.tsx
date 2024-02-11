import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useVaultConfig } from "src/ui/config/hooks/useVaultConfig";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";
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
  const { address: account } = useAccount();
  const { data, status, error } = useFrozenLockingVaultDetailsData(
    address,
    account,
  );

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
  accountVotingPower: `${number}`;
  activeProposalCount: number;
  delegate?: `0x${string}`;
  delegatedToAccount: number;
  depositedBalance: `${number}`;
  paragraphSummary: string | undefined;
  descriptionURL: string | undefined;
  name: string | undefined;
  participants: number;
  tokenAddress: `0x${string}`;
  tokenAllowance: `${number}`;
  tokenBalance: `${number}`;
  tokenSymbol: string;
}

function useFrozenLockingVaultDetailsData(
  address: `0x${string}`,
  account: `0x${string}` | undefined,
): UseQueryResult<LockingVaultDetailsData> {
  const council = useReadWriteCouncil();
  const vaultConfig = useVaultConfig(address);

  const enabled = !!council;

  return useQuery({
    queryKey: ["frozenLockingVaultDetails", address, account],
    enabled,
    queryFn: enabled
      ? async () => {
          const lockingVault = council.lockingVault(address);
          const token = await lockingVault.getToken();
          const delegate = account
            ? await lockingVault.getDelegate({ account })
            : undefined;
          const accountVotingPower = account
            ? await lockingVault.getVotingPower({ account })
            : "0";

          return {
            accountVotingPower,
            tokenAddress: token.address,
            tokenSymbol: await token.getSymbol(),
            tokenBalance: account
              ? await token.getBalanceOf({ address: account })
              : "0",

            tokenAllowance: account
              ? await token.getAllowance({ owner: account, spender: address })
              : "0",

            depositedBalance: account
              ? await lockingVault.getDepositedBalance({ account })
              : "0",

            delegate: delegate?.address,
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
