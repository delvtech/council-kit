import { ReadVote, VoteResults } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";

type VoteResultsFormatted = {
  [K in keyof VoteResults]: string;
};

export function useVoteResults({ proposal }: ReadVote): {
  voteResults: VoteResults | undefined;
  voteResultsFormatted: VoteResultsFormatted | undefined;
  status: QueryStatus;
} {
  const { data, status } = useQuery({
    queryKey: [proposal.coreVoting.address, proposal.id],
    queryFn: () => proposal.getResults(),
  });

  const formattedResults =
    data &&
    Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value)]),
    );

  return {
    voteResults: data,
    voteResultsFormatted: formattedResults as VoteResultsFormatted | undefined,
    status,
  };
}
