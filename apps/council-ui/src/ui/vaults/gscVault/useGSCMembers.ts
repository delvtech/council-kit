import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

export function useGSCMemberAddresses(): UseQueryResult<string[]> {
  const { gscVoting } = useCouncil();
  return useQuery({
    queryKey: ["gsc-status"],
    enabled: !!gscVoting,
    queryFn: !!gscVoting
      ? async () => {
          const members = await gscVoting.getVoters();
          return members.map(({ address }) => address);
        }
      : undefined,
  });
}
