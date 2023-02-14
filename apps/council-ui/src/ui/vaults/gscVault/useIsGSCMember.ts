import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

/**
 * GSC Status (which includes eligible, ineligible statuses) is an expensive
 * lookup, but just checking if someone is a member is cheap. Prefer this
 * instead of the heavier useGSCStatus hook whenever possible.
 */
export function useIsGSCMember(
  address: string | undefined,
): UseQueryResult<boolean> {
  const { gscVoting } = useCouncil();
  const queryEnabled = !!address;
  return useQuery({
    queryKey: ["gsc-status", address],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<boolean> => {
          if (!gscVoting) {
            return false;
          }
          const members = await gscVoting.getVoters();
          const memberAddresses = members.map(({ address }) => address);
          return memberAddresses.includes(address);
        }
      : undefined,
  });
}
