import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useReadGscVault } from "src/ui/vaults/gscVault/hooks/useReadGscVault";
import { getGscStatus } from "src/utils/gscVault/getGscStatus";
import { GscStatus } from "src/utils/gscVault/types";

export function useGscStatus(account: `0x${string}` | undefined): {
  gscStatus: GscStatus | undefined;
  status: QueryStatus;
} {
  const coreVoting = useReadCoreVoting();
  const gscVault = useReadGscVault();

  const { data, status } = useQuery({
    queryKey: ["gsc-status", account],
    queryFn: () =>
      getGscStatus({
        account,
        qualifyingVaults: coreVoting.vaults,
        gscVault,
      }),
  });

  return {
    gscStatus: data,
    status,
  };
}
