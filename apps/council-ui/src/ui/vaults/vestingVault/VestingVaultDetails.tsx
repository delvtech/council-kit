import { getBlockDate, VestingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ethers, Signer } from "ethers";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { ChangeDelegateForm } from "src/ui/vaults/ChangeDelegateForm";
import { VaultHeader, VaultHeaderSkeleton } from "src/ui/vaults/VaultHeader";
import {
  GrantCard,
  GrantCardSkeleton,
} from "src/ui/vaults/vestingVault/GrantCard";
import { useChangeDelegate } from "src/ui/vaults/vestingVault/hooks/useChangeDelegate";
import {
  VaultStatsBarSkeleton,
  VestingVaultStatsBar,
} from "src/ui/vaults/vestingVault/VestingVaultStatsBar";
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

  return (
    <>
      {status === "success" ? (
        <VaultHeader name={data.name} descriptionURL={data.descriptionURL} />
      ) : (
        <VaultHeaderSkeleton />
      )}

      {status === "success" ? (
        <VestingVaultStatsBar
          accountVotingPower={data.accountVotingPower}
          accountPercentOfTVP={data.accountPercentOfTVP}
          unvestedMultiplier={data.unvestedMultiplier}
          delegatedToAccount={data.delegatedToAccount}
          participants={data.participants}
          tokenAddress={data.tokenAddress}
          tokenSymbol={data.tokenSymbol}
        />
      ) : (
        <VaultStatsBarSkeleton />
      )}

      <div className="flex flex-col w-full h-48 gap-8 sm:flex-row">
        <div className="basis-1/2">
          {status === "success" ? (
            <GrantCard
              vestingVaultAddress={address}
              grantBalance={data.grantBalance}
              grantBalanceWithdrawn={data.grantBalanceWithdrawn}
              expirationDate={data.expirationDate}
              unlockDate={data.unlockDate}
            />
          ) : (
            <GrantCardSkeleton />
          )}
        </div>
        {status === "success" && (
          <ChangeDelegateForm
            currentDelegate={data.delegate || ethers.constants.AddressZero}
            disabled={!signer || !+data.accountVotingPower}
            onDelegate={(delegate) =>
              changeDelegate({ signer: signer as Signer, delegate })
            }
          />
        )}
      </div>
    </>
  );
}

interface VestingVaultDetailsData {
  accountPercentOfTVP: number;
  accountVotingPower: string;
  unvestedMultiplier: number;
  delegate?: string;
  delegatedToAccount: number;
  descriptionURL: string | undefined;
  expirationDate: Date | null;
  grantBalance: string;
  grantBalanceWithdrawn: string;
  name: string | undefined;
  participants: number;
  tokenAddress: string;
  tokenBalance: string;
  tokenDecimals: number;
  tokenSymbol: string;
  unlockDate: Date | null;
}

function useVestingVaultDetailsData(
  address: string,
  account: string | undefined,
): UseQueryResult<VestingVaultDetailsData> {
  const { context, coreVoting } = useCouncil();

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
      const tokenDecimals = await token.getDecimals();
      const grant = account ? await vestingVault.getGrant(account) : undefined;
      const accountVotingPower = account
        ? await vestingVault.getVotingPower(account)
        : "0";

      return {
        tokenAddress: token.address,
        tokenSymbol: await token.getSymbol(),
        tokenDecimals,
        tokenBalance: account ? await token.getBalanceOf(account) : "0",
        grantBalance: grant?.allocation || "0",
        grantBalanceWithdrawn: grant?.withdrawn || "0",
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
        accountPercentOfTVP:
          (+accountVotingPower / +(await vestingVault.getTotalVotingPower())) *
          100,
      };
    },
  });
}
