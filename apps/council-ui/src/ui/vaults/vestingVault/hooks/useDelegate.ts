import { VestingVault, Voter } from "@council/sdk";
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
          const vestingVault = new VestingVault(vaultAddress, context);
          return vestingVault.getDelegate(accountAddress);
        }
      : undefined,
  });
}
