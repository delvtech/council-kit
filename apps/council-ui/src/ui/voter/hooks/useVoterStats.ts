import { Vote, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";
import { GSCStatus } from "src/ui/utils/formatGSCStatus";
import { getFormattedGSCStatus } from "src/ui/voter/utils/getFormattedGSCStatus";

interface VoterStatistics {
  votingHistory: Vote[];
  votingPower: string;
  gscStatus: GSCStatus | null;
}

export function useVoterStats(
  address: string | undefined,
): UseQueryResult<VoterStatistics> {
  const { context, coreVoting, gscVoting } = useCouncil();

  return useQuery({
    queryKey: [
      "voter-stats",
      address,
      Voter,
      context,
      coreVoting.address,
      gscVoting,
    ],
    enabled: !!address,
    queryFn: async () => {
      const voter = new Voter(address as string, context);
      const votingHistory = await voter.getVotes(coreVoting.address);
      const votingPower = await voter.getVotingPower(
        coreVoting.vaults.map((vault) => vault.address),
      );
      const gscStatus = gscVoting
        ? await getFormattedGSCStatus(address as string, gscVoting)
        : null;

      return {
        votingHistory: votingHistory,
        votingPower,
        gscStatus,
      };
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
