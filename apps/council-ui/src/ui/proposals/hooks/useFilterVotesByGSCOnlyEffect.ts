import { ReadVote } from "@delvtech/council-viem";
import { useEffect } from "react";
import { asyncFilter } from "src/ui/base/utils/asyncFilter";
import { useReadGscVault } from "src/ui/vaults/gscVault/hooks/useReadGscVault";

export function useFilterVotesByGSCOnlyEffect(
  votes: ReadVote[],
  gscOnly: boolean,
  setFilteredVotes: (votes: ReadVote[]) => void,
): void {
  const gscVault = useReadGscVault();

  return useEffect(() => {
    if (gscOnly && gscVault) {
      asyncFilter(votes, ({ voter }) =>
        gscVault.getIsMember({
          account: voter,
        }),
      ).then((filteredVotes) => setFilteredVotes(filteredVotes));
    } else {
      // reset filter
      setFilteredVotes(votes);
    }
  }, [gscOnly, gscVault]);
}
