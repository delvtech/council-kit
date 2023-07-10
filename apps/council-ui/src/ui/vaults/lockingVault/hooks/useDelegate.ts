import { LockingVault, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

export function useDelegate(
  vaultAddress: string | undefined,
  accountAddress: string | undefined,
): UseQueryResult<Voter> {
  const { context } = useCouncil();
  const enabled = !!vaultAddress && !!accountAddress;
  return useQuery({
    queryKey: ["delegate", vaultAddress, accountAddress],
    enabled,
    queryFn: enabled
      ? async () => {
          const lockingVault = new LockingVault(vaultAddress, context);
          return lockingVault.getDelegate(accountAddress);
        }
      : undefined,
  });
}
