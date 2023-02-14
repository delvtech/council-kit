import { getBlockDate, VestingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ethers, Signer } from "ethers";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { ChangeDelegateForm } from "src/ui/vaults/ChangeDelegateForm";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { GrantCard } from "src/ui/vaults/vestingVault/GrantCard";
import { useChangeDelegate } from "src/ui/vaults/vestingVault/hooks/useChangeDelegate";
import { VestingVaultStatsRow } from "src/ui/vaults/vestingVault/VestingVaultStatsRow";
import { useAccount, useSigner } from "wagmi";

interface VestingVaultDetailsProps {
  address: string;
}

export function VestingVaultDetails({
  address,
}: VestingVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data: signer } = useSigner();
  const { data, status, error } = useVestingVaultDetailsData(address, account);
  const { mutate: changeDelegate } = useChangeDelegate(address);

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  if (status !== "success") {
    return <VaultDetailsSkeleton />;
  }
  return (
    <VaultDetails
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
              grantBalanceWithdrawn={data.grantBalanceWithdrawn}
              expirationDate={data.expirationDate}
              unlockDate={data.unlockDate}
            />
          </div>
          <ChangeDelegateForm
            currentDelegate={data.delegate || ethers.constants.AddressZero}
            depositedBalance={data.grantBalance}
            onDelegate={(delegate) =>
              changeDelegate({ signer: signer as Signer, delegate })
            }
          />
        </>
      }
    />
  );
}

interface VestingVaultDetailsData {
  accountVotingPower: string;
  unvestedMultiplier: number;
  delegate?: string;
  delegatedToAccount: number;
  descriptionURL: string | undefined;
  paragraphSummary: string | undefined;
  expirationDate: Date | null;
  grantBalance: string;
  grantBalanceWithdrawn: string;
  name: string | undefined;
  participants: number;
  tokenAddress: string;
  tokenSymbol: string;
  unlockDate: Date | null;
}

function useVestingVaultDetailsData(
  address: string,
  account: string | undefined,
): UseQueryResult<VestingVaultDetailsData> {
  const { context } = useCouncil();

  const chainId = useChainId();
  const coreVotingConfig = councilConfigs[chainId].coreVoting;
  const vaultConfig = coreVotingConfig.vaults.find(
    (vault) => vault.address === address,
  );

  return useQuery({
    queryKey: ["vestingVaultDetails", address, account],
    queryFn: async (): Promise<VestingVaultDetailsData> => {
      const vestingVault = new VestingVault(address, context);
      const token = await vestingVault.getToken();
      const grant = account ? await vestingVault.getGrant(account) : undefined;
      const accountVotingPower = account
        ? await vestingVault.getVotingPower(account)
        : "0";

      return {
        tokenAddress: token.address,
        tokenSymbol: await token.getSymbol(),
        grantBalance: grant?.allocation || "0",
        grantBalanceWithdrawn: grant?.withdrawn || "0",
        paragraphSummary: vaultConfig?.paragraphSummary,
        unlockDate: grant
          ? await getBlockDate(grant.unlockBlock, context.provider, {
              estimateFutureDates: true,
            })
          : null,
        expirationDate: grant
          ? await getBlockDate(grant.expirationBlock, context.provider, {
              estimateFutureDates: true,
            })
          : null,
        delegate: account
          ? (await vestingVault.getDelegate(account)).address
          : undefined,
        descriptionURL: vaultConfig?.descriptionURL,
        name: vaultConfig?.name,
        accountVotingPower,
        unvestedMultiplier: await vestingVault.getUnvestedMultiplier(),
        participants: (await vestingVault.getVoters()).length,
        delegatedToAccount: account
          ? (await vestingVault.getDelegatorsTo(account)).length
          : 0,
      };
    },
  });
}
