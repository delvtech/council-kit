import { LockingVault, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";
import { useAccount } from "wagmi";

export function useDelegate(vaultAddress: string): UseQueryResult<Voter> {
  const { context } = useCouncil();
  const { address } = useAccount();
  return useQuery({
    queryKey: ["delegate", vaultAddress, address],
    enabled: !!address,
    queryFn: !!address
      ? async () => {
          const lockingVault = new LockingVault(vaultAddress, context);
          return lockingVault.getDelegate(address);
        }
      : undefined,
  });
}
