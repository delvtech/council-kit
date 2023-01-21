import { Vote, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";
import { useGSCStatus } from "src/ui/vaults/gscVault/useGSCStatus";
import { GSCStatus } from "src/vaults/gscVault";

interface VoterStatistics {
  votingHistory: Vote[];
  votingPower: string;
  gscStatus: GSCStatus | null;
}

export function useVoterStats(
  address: string | undefined,
): UseQueryResult<VoterStatistics> {
  const { context, coreVoting } = useCouncil();
  const { data: gscStatus } = useGSCStatus(address);
  return useQuery({
    queryKey: ["voter-stats", address],
    enabled: !!address,
    queryFn: async () => {
      const voter = new Voter(address as string, context);
      const votingHistory = await voter.getVotes(coreVoting.address);
      const votingPower = await voter.getVotingPower(
        coreVoting.vaults.map((vault) => vault.address),
      );

      return {
        votingHistory: votingHistory,
        votingPower,
        gscStatus: gscStatus ?? null,
      };
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
