import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";
import { formatGSCStatus, GSCStatus } from "src/ui/utils/formatGSCStatus";

export function useFormattedGSCStatus(
  address: string,
): UseQueryResult<GSCStatus> {
  const { gscVoting } = useCouncil();
  return useQuery(["gsc-status", address], async () => {
    const isIdle = await gscVoting?.getIsIdle(address);
    const isMember = await gscVoting?.getIsMember(address);
    const isEligible = await gscVoting?.getIsEligible(address);

    return formatGSCStatus(isIdle, isMember, isEligible);
  });
}
