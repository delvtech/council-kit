import { VotingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

export function useVaultVotingPower(
  vaultAddress: string,
  voterAddress: string | undefined,
): UseQueryResult<string> {
  const { context } = useCouncil();
  const votingVault = new VotingVault(vaultAddress, context);
  return useQuery({
    queryKey: ["vaultVotingPower", vaultAddress, voterAddress],
    enabled: !!voterAddress,
    queryFn: !!voterAddress
      ? () => votingVault.getVotingPower(voterAddress)
      : undefined,
  });
}
