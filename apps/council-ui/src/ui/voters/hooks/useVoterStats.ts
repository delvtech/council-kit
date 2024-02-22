import { ReadVote } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { useGscStatus } from "src/ui/vaults/gscVault/hooks/useGscStatus";
import { GscStatus } from "src/utils/gscVault/types";

interface VoterStatistics {
  votingHistory: ReadVote[];
  votingPower: bigint;
  gscStatus: GscStatus | undefined;
}

export function useVoterStats(address: `0x${string}` | undefined): {
  data: VoterStatistics | undefined;
  status: QueryStatus;
} {
  const coreVoting = useReadCoreVoting();
  const council = useReadCouncil();
  const { gscStatus } = useGscStatus(address);

  const enabled = !!address;

  const { data, status } = useQuery({
    queryKey: ["voter-stats", address],
    enabled,
    queryFn: enabled
      ? async () => {
          const voter = council.voter(address);
          const votingHistory = await voter.getVotes({ coreVoting });
          const votingPower = await coreVoting.getVotingPower({
            account: voter,
          });

          return {
            votingHistory: votingHistory,
            votingPower,
            gscStatus: gscStatus,
          };
        }
      : undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { data, status };
}
