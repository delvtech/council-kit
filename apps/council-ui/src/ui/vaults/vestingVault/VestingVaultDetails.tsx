import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { getVaultConfig } from "src/config/utils/getVaultConfig";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { getBlockDate } from "src/ui/base/utils/getBlockDate";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import { ChangeDelegateForm } from "src/ui/vaults/ChangeDelegateForm";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { GrantCard } from "src/ui/vaults/vestingVault/GrantCard";
import { useChangeDelegate } from "src/ui/vaults/vestingVault/hooks/useChangeDelegate";
import { VestingVaultStatsRow } from "src/ui/vaults/vestingVault/VestingVaultStatsRow";
import { getVotingPower } from "src/utils/vaults/getVotingPower";
import { Address } from "viem";
import { useAccount } from "wagmi";

interface VestingVaultDetailsProps {
  address: Address;
}

export function VestingVaultDetails({
  address,
}: VestingVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data, status, error } = useVestingVaultDetailsData(address, account);
  const chainId = useSupportedChainId();
  const vaultConfig = getVaultConfig({ address, chainId });
  const name = vaultConfig?.name || "Vesting Vault";

  const { write: changeDelegate } = useChangeDelegate();

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  if (status !== "success") {
    return <VaultDetailsSkeleton />;
  }
  return (
    <VaultDetails
      name={name}
      paragraphSummary={vaultConfig?.paragraphSummary}
      header={
        <VaultHeader name={name} descriptionURL={vaultConfig?.descriptionURL} />
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
              decimals={data.tokenDecimals}
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
  tokenDecimals: number;
  delegate?: `0x${string}`;
  delegatedToAccount: number;
  expirationDate: Date | undefined;
  grantBalance: bigint;
  grantBalanceWithdrawn: bigint;
  participants: number;
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  unlockDate: Date | undefined;
}

function useVestingVaultDetailsData(
  address: `0x${string}`,
  account: `0x${string}` | undefined,
): UseQueryResult<VestingVaultDetailsData> {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const enabled = !!council;

  return useQuery({
    queryKey: ["vestingVaultDetails", address, account],
    enabled,
    queryFn: enabled
      ? async (): Promise<VestingVaultDetailsData> => {
          const vestingVault = council.vestingVault(address);

          const [
            token,
            voters,
            unvestedMultiplier,
            grant,
            delegate,
            delegators,
            accountVotingPower,
          ] = await Promise.all([
            vestingVault.getToken(),
            vestingVault.getVoters(),
            vestingVault.getUnvestedMultiplier(),
            account ? vestingVault.getGrant(account) : undefined,
            account ? vestingVault.getDelegate(account) : undefined,
            account ? vestingVault.getDelegatorsTo(account) : [],
            account
              ? getVotingPower({
                  chainId,
                  vault: address,
                  voter: account,
                })
              : 0n,
          ]);

          const [tokenSymbol, tokenDecimals, unlockDate, expirationDate] =
            await Promise.all([
              token.getSymbol(),
              token.getDecimals(),
              grant ? await getBlockDate(grant.cliffBlock, chainId) : undefined,
              grant
                ? await getBlockDate(grant.expirationBlock, chainId)
                : undefined,
            ]);

          return {
            participants: voters.length,
            unvestedMultiplier,
            grantBalance: grant?.allocation || 0n,
            grantBalanceWithdrawn: grant?.withdrawn || 0n,
            accountVotingPower,
            delegate,
            delegatedToAccount: delegators.length,
            tokenAddress: token.address,
            tokenSymbol,
            tokenDecimals,
            unlockDate,
            expirationDate,
          };
        }
      : undefined,
  });
}
