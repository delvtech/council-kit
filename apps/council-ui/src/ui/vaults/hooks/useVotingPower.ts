import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

export function useVotingPower(
  address: string | undefined,
): UseQueryResult<string> {
  const { coreVoting } = useCouncil();
  return useQuery({
    queryKey: ["votingPower", address],
    enabled: !!address,
    queryFn: !!address ? () => coreVoting.getVotingPower(address) : undefined,
  });
}
