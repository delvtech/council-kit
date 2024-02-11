import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useReadGscVault } from "src/ui/vaults/gscVault/hooks/useReadGscVault";
import { getGscStatus } from "src/vaults/gscVault/getGscStatus";
import { GscStatus } from "src/vaults/gscVault/types";

export function useGscStatus(account: `0x${string}` | undefined): {
  gscStatus: GscStatus | undefined;
  status: QueryStatus;
} {
  const coreVoting = useReadCoreVoting();
  const gscVault = useReadGscVault();
  const enabled = !!account;

  const { data, status } = useQuery({
    queryKey: ["gsc-status", account],
    enabled,
    queryFn: enabled
      ? async () =>
          getGscStatus({
            account,
            qualifyingVaults: coreVoting.vaults,
            gscVault,
          })
      : undefined,
  });

  return {
    gscStatus: data,
    status,
  };
}
