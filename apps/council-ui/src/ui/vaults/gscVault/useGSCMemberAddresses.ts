import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

export function useGSCMemberAddresses(): UseQueryResult<string[]> {
  const { gscVoting } = useCouncil();
  return useQuery({
    queryKey: ["gsc-status", !!gscVoting],
    queryFn: async () => {
      if (!gscVoting) {
        return [];
      }
      const members = await gscVoting.getVoters();
      return members.map(({ address }) => address);
    },
  });
}
