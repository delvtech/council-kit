import { Vote, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

export function useVotingHistory(
  address: string | undefined,
): UseQueryResult<Vote[]> {
  const { context, coreVoting } = useCouncil();

  return useQuery(
    ["voting-history", address],
    async () => {
      const voter = new Voter(address as string, context);
      return voter.getVotes(coreVoting.address);
    },
    {
      enabled: !!address,
    },
  );
}
