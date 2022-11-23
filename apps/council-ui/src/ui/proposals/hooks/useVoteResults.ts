import { Vote, VoteResults } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useVoteResults(vote: Vote): UseQueryResult<VoteResults> {
  return useQuery([], async () => {
    const results = await vote.proposal.getResults();
    return results;
  });
}
