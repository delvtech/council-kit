import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { useAccount } from "wagmi";
import { GenericVaultStatsRow } from "./GenericVaultStatsRow";

interface GenericVaultDetailsProps {
  address: `0x${string}`;
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
        <GenericVaultStatsRow accountVotingPower={data.accountVotingPower} />
      }
    />
  );
}

interface GenericVaultDetailsData {
  accountVotingPower: bigint;
  descriptionURL: string | undefined;
  paragraphSummary: string | undefined;
  name: string | undefined;
}

function useGenericVaultDetailsData(
  address: `0x${string}`,
  account: `0x${string}` | undefined,
): UseQueryResult<GenericVaultDetailsData> {
  const council = useReadCouncil();
  const chainId = useSupportedChainId();
  const coreVotingConfig = councilConfigs[chainId].coreVoting;
  const vaultConfig = coreVotingConfig.vaults.find(
    (vault) => vault.address === address,
  );

  return useQuery({
    queryKey: ["genericVaultDetails", address, account],
    queryFn: async () => {
      const vault = council.votingVault(address);
      const accountVotingPower = account
        ? await vault.getVotingPower({ account })
        : 0n;

      return {
        accountVotingPower,
        descriptionURL: vaultConfig?.descriptionURL,
        paragraphSummary: vaultConfig?.paragraphSummary,
        name: vaultConfig?.name,
      };
    },
  });
}
