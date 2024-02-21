import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { getBlockDate } from "src/ui/base/utils/getBlockDate";
import { useVaultConfig } from "src/ui/config/hooks/useVaultConfig";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { ChangeDelegateForm } from "src/ui/vaults/ChangeDelegateForm";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { GrantCard } from "src/ui/vaults/vestingVault/GrantCard";
import { useChangeDelegate } from "src/ui/vaults/vestingVault/hooks/useChangeDelegate";
import { VestingVaultStatsRow } from "src/ui/vaults/vestingVault/VestingVaultStatsRow";
import { useAccount, usePublicClient } from "wagmi";

interface VestingVaultDetailsProps {
  address: `0x${string}`;
}

export function VestingVaultDetails({
  address,
}: VestingVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data, status, error } = useVestingVaultDetailsData(address, account);
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
        <VestingVaultStatsRow
          accountVotingPower={data.accountVotingPower}
          unvestedMultiplier={data.unvestedMultiplier}
          delegatedToAccount={data.delegatedToAccount}
          participants={data.participants}
          tokenAddress={data.tokenAddress}
          tokenSymbol={data.tokenSymbol}
        />
      }
      actions={
        <>
          <div className="basis-1/2">
            <GrantCard
              vestingVaultAddress={address}
              grantBalance={data.grantBalance}
              decimals={data.decimals}
              grantBalanceWithdrawn={data.grantBalanceWithdrawn}
              expirationDate={data.expirationDate}
              unlockDate={data.unlockDate}
            />
          </div>

          <ChangeDelegateForm
            currentDelegate={data.delegate}
            onDelegate={(newDelegate) =>
              changeDelegate?.({ newDelegate, vaultAddress: address })
            }
            disabled={!changeDelegate}
          />
        </>
      }
    />
  );
}

interface VestingVaultDetailsData {
  accountVotingPower: bigint;
  unvestedMultiplier: bigint;
  decimals: number;
  delegate?: `0x${string}`;
  delegatedToAccount: number;
  descriptionURL: string | undefined;
  paragraphSummary: string | undefined;
  expirationDate: Date | undefined;
  grantBalance: bigint;
  grantBalanceWithdrawn: bigint;
  name: string | undefined;
  participants: number;
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  unlockDate: Date | undefined;
}

function useVestingVaultDetailsData(
  address: `0x${string}`,
  account: `0x${string}` | undefined,
): UseQueryResult<VestingVaultDetailsData> {
  const council = useReadCouncil();
  const vaultConfig = useVaultConfig(address);
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["vestingVaultDetails", address, account],
    queryFn: async (): Promise<VestingVaultDetailsData> => {
      const vestingVault = council.vestingVault(address);
      const token = await vestingVault.getToken();
      const grant = account
        ? await vestingVault.getGrant({ account })
        : undefined;
      const accountVotingPower = account
        ? await vestingVault.getVotingPower({ account })
        : 0n;

      return {
        tokenAddress: token.address,
        tokenSymbol: await token.getSymbol(),
        decimals: await token.getDecimals(),
        grantBalance: grant?.allocation || 0n,
        grantBalanceWithdrawn: grant?.withdrawn || 0n,
        paragraphSummary: vaultConfig?.paragraphSummary,
        unlockDate: grant
          ? await getBlockDate(grant.cliff, publicClient)
          : undefined,
        expirationDate: grant
          ? await getBlockDate(grant.expiration, publicClient)
          : undefined,
        delegate: account
          ? (await vestingVault.getDelegate({ account })).address
          : undefined,
        descriptionURL: vaultConfig?.descriptionURL,
        name: vaultConfig?.name,
        accountVotingPower,
        unvestedMultiplier: await vestingVault.getUnvestedMultiplier(),
        participants: (await vestingVault.getVoters()).length,
        delegatedToAccount: account
          ? (await vestingVault.getDelegatorsTo({ account })).length
          : 0,
      };
    },
  });
}
