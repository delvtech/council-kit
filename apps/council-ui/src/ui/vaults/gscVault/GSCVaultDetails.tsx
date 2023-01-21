import { GSCVault, GSCVotingContract } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { VaultConfig, VotingContractConfig } from "src/config/CouncilConfig";
import { getActiveProposalCount } from "src/proposals/getActiveProposalCount";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";

import { VaultHeader, VaultHeaderSkeleton } from "src/ui/vaults/VaultHeader";
import { useAccount } from "wagmi";

interface GSCVaultDetailsProps {
  address: string;
}

export function GSCVaultDetails({
  address,
}: GSCVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data, status, error } = useGSCVaultDetails(address, account);

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

      {/* TODO: Stats here */}

      <div className="flex flex-col w-full h-48 gap-8 sm:flex-row">
        {/* TODO: Forms and GSC Members table here */}
      </div>
    </>
  );
}

interface GSCVaultDetailsData {
  isAccountGSCMember: boolean;
  activeProposalCount: number;
  descriptionURL: string | undefined;
  name: string | undefined;
  participants: number;
}

function useGSCVaultDetails(
  address: string,
  account: string | undefined,
): UseQueryResult<GSCVaultDetailsData> {
  const { context, gscVoting } = useCouncil();
  const chainId = useChainId();
  // safe to cast because this component should never be rendered unless it's
  // already known that there's a GSC Core Voting in the system.
  // See: pages/vaults/details.tsx
  const gscCoreVotingConfig = councilConfigs[chainId]
    .gscVoting as VotingContractConfig;
  const vaultConfig = gscCoreVotingConfig.vaults.find(
    (vault) => vault.address === address,
  ) as VaultConfig;

  const queryEnabled = !!account;
  return useQuery({
    queryKey: ["gscLockingVaultDetails", address, account],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<GSCVaultDetailsData> => {
          const gscVault = new GSCVault(address, context);

          const activeProposalCount = await getActiveProposalCount(
            gscVoting as GSCVotingContract,
          );
          const isAccountGSCMember = await gscVault.getIsMember(account);
          const participants = (await gscVault.getVoters()).length;

          return {
            isAccountGSCMember,
            descriptionURL: vaultConfig.descriptionURL,
            name: vaultConfig.name,
            activeProposalCount,
            participants: participants,
          };
        }
      : undefined,
  });
}
