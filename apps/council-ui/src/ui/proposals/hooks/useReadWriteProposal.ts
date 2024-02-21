import {
  ReadVotingVault,
  ReadWriteCoreVoting,
  ReadWriteProposal,
} from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

export interface UseReadWriteProposalOptions {
  id: bigint;
  coreVoting?: ReadWriteCoreVoting | `0x${string}`;
  vaults?: (ReadVotingVault | `0x${string}`)[];
}

interface UseReadWriteProposalResult {
  proposal: ReadWriteProposal | undefined;
  status: QueryStatus;
}

/**
 * Use a ReadWriteProposal instance for a given proposal id and core voting
 * address. Defaults to the coreVoting from the council config.
 */
export function useReadProposal({
  id,
  coreVoting,
  vaults,
}: UseReadWriteProposalOptions): UseReadWriteProposalResult {
  const council = useReadWriteCouncil();
  const { coreVoting: configuredCoreVoting, gscVoting } = useCouncilConfig();

  let coreVotingAddressToUse =
    typeof coreVoting === "string" ? coreVoting : coreVoting?.address;
  if (!coreVotingAddressToUse) {
    coreVotingAddressToUse = configuredCoreVoting.address;
  }
  const isConfiguredCoreVoting =
    coreVotingAddressToUse === configuredCoreVoting.address;
  const isConfiguredGscVoting = coreVotingAddressToUse === gscVoting?.address;

  let vaultsToUse = vaults;
  if (!vaultsToUse && isConfiguredCoreVoting) {
    vaultsToUse = configuredCoreVoting.vaults.map(({ address }) => address);
  } else if (!vaultsToUse && isConfiguredGscVoting) {
    vaultsToUse = [gscVoting.vault.address];
  }

  const enabled = !!coreVotingAddressToUse;

  const { data, status } = useQuery({
    queryKey: ["proposal", id, coreVotingAddressToUse, vaultsToUse],
    enabled,
    queryFn: enabled
      ? () =>
          council
            ?.coreVoting({
              address: coreVotingAddressToUse!,
              vaults: vaultsToUse,
            })
            .getProposal({ id })
      : undefined,
  });

  return {
    proposal: data,
    status,
  };
}
