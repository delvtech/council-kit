import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";
import { formatGSCStatus, GSCStatus } from "src/ui/utils/formatGSCStatus";

export function useFormattedGSCStatus(
  address: string | undefined,
): UseQueryResult<GSCStatus> {
  const { gscVoting } = useCouncil();
  return useQuery({
    queryKey: ["gsc-status", address],
    enabled: !!address,
    queryFn: async () => {
      // safe to cast because enabled is set
      const isIdle = await gscVoting?.getIsIdle(address as string);
      const isMember = await gscVoting?.getIsMember(address as string);
      const isEligible = await gscVoting?.getIsEligible(address as string);

      return formatGSCStatus(isIdle, isMember, isEligible);
    },
  });
}
