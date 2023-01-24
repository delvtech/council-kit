import { Vote } from "@council/sdk";
import { useEffect } from "react";
import { asyncFilter } from "src/ui/base/utils/asyncFilter";
import { useCouncil } from "src/ui/council/useCouncil";

export function useFilterVotesByGSCOnlyEffect(
  votes: Vote[],
  gscOnly: boolean,
  setFilteredVotes: (votes: Vote[]) => void,
): void {
  const { gscVoting } = useCouncil();

  return useEffect(() => {
    if (gscOnly && gscVoting) {
      asyncFilter(votes, (vote) =>
        gscVoting.getIsMember(vote.voter.address),
      ).then((filteredVotes) => setFilteredVotes(filteredVotes));
    } else {
      // reset filter
      setFilteredVotes(votes);
    }
  }, [gscOnly]);
}
