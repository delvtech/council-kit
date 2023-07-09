import { LockingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

/**
 * Fetch the locking vault for the airdrop.
 */
export function useAirdropLockingVault(): UseQueryResult<
  LockingVault | undefined
> {
  const { airdrop } = useCouncil();
  return useQuery({
    queryKey: ["airdropLockingVault", airdrop?.address],
    enabled: !!airdrop,
    queryFn: !!airdrop ? () => airdrop.getLockingVault() : undefined,
  });
}
