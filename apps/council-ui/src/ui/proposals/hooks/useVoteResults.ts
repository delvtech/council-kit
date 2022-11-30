import { Vote, VoteResults } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useVoteResults(vote: Vote): UseQueryResult<VoteResults> {
  return useQuery({
    queryKey: [vote.proposal.votingContract.address, vote.proposal.id],
    queryFn: async () => {
      const results = await vote.proposal.getResults();
      return results;
    },
  });
}
