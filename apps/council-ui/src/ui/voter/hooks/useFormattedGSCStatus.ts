import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";
import { formatGSCStatus, GSCStatus } from "src/ui/utils/formatGSCStatus";

export function useFormattedGSCStatus(
  address: string | undefined,
): UseQueryResult<GSCStatus> {
  const { gscVoting } = useCouncil();
  return useQuery({
    queryKey: ["gsc-status", address],
    queryFn: async () => {
      if (!address) {
        return undefined;
      }

      const isIdle = await gscVoting?.getIsIdle(address);
      const isMember = await gscVoting?.getIsMember(address);
      const isEligible = await gscVoting?.getIsEligible(address);

      return formatGSCStatus(isIdle, isMember, isEligible);
    },
  });
}
