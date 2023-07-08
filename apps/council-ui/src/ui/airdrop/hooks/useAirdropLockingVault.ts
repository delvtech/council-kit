import { Airdrop, LockingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

/**
 * Fetch the locking vault for the given airdrop contract address.
 * @param airdropContractAddress - The address of the airdrop contract
 * @returns The locking vault and the status of the request
 */
export function useAirdropLockingVault(
  airdropContractAddress?: string,
): UseQueryResult<LockingVault | undefined> {
  const { context } = useCouncil();
  return useQuery({
    queryKey: ["airdropLockingVault", airdropContractAddress],
    enabled: !!airdropContractAddress,
    queryFn: !!airdropContractAddress
      ? () => {
          const airdrop = new Airdrop(airdropContractAddress, context);
          return airdrop.getLockingVault();
        }
      : undefined,
  });
}
