import { VotingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";

import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { useAccount } from "wagmi";
import { GenericVaultStatsRow } from "./GenericVaultStatsRow";

interface GenericVaultDetailsProps {
  address: string;
}

export function GenericVaultDetails({
  address,
}: GenericVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data, status, error } = useGenericVaultDetailsData(address, account);

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
        <GenericVaultStatsRow
          accountVotingPower={data.accountVotingPower}
          participants={data.participants}
        />
      }
    />
  );
}

interface GenericVaultDetailsData {
  accountVotingPower: string;
  descriptionURL: string | undefined;
  paragraphSummary: string | undefined;
  name: string | undefined;
  participants?: number;
}

function useGenericVaultDetailsData(
  address: string,
  account: string | undefined,
): UseQueryResult<GenericVaultDetailsData> {
  const { context } = useCouncil();
  const chainId = useChainId();
  const coreVotingConfig = councilConfigs[chainId].coreVoting;
  const vaultConfig = coreVotingConfig.vaults.find(
    (vault) => vault.address === address,
  );

  return useQuery({
    queryKey: ["genericVaultDetails", address, account],
    queryFn: async () => {
      const vault = new VotingVault(address, context);
      const accountVotingPower = account
        ? await vault.getVotingPower(account)
        : "0";

      return {
        accountVotingPower,
        descriptionURL: vaultConfig?.descriptionURL,
        paragraphSummary: vaultConfig?.paragraphSummary,
        name: vaultConfig?.name,
        participants: vault.getVoters
          ? (await vault.getVoters()).length
          : undefined,
      };
    },
  });
}
