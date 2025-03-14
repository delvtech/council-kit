import { useQuery } from "@tanstack/react-query";
import { useReadGscVault } from "./useReadGscVault";

/**
 * GSC Status (which includes eligible, ineligible statuses) is an expensive
 * lookup, but just checking if someone is a member is cheap. Prefer this
 * instead of the heavier useGSCStatus hook whenever possible.
 */
export function useIsGscMember(account: `0x${string}` | undefined) {
  const gscVault = useReadGscVault();
  const enabled = !!account;
  return useQuery({
    queryKey: ["useIsGSCMember", account],
    enabled: enabled,
    queryFn: enabled ? async () => !!gscVault?.getIsMember(account) : undefined,
  });
}
