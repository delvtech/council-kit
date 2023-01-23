import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";
import { getGSCStatus, GSCStatus } from "src/vaults/gscVault";

export function useGSCStatus(
  address: string | undefined,
): UseQueryResult<GSCStatus> {
  const { gscVoting, coreVoting } = useCouncil();
  const queryEnabled = !!address;
  return useQuery({
    queryKey: ["gsc-status", address],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<GSCStatus> =>
          getGSCStatus({ coreVoting, gscVoting, address })
      : undefined,
  });
}
