import { Vote, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";
import { GSCStatus } from "src/ui/utils/formatGSCStatus";
import { useVotingHistory } from "src/ui/voter/hooks/useVotingHistory";
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
  const { data: votingHistory } = useVotingHistory(address);

  return useQuery(
    ["voter-stats", address],
    async () => {
      // We can safely assume address will never be nullable because of our enabled option
      const voter = new Voter(address as string, context);
      const votingPower = await voter.getVotingPower(
        coreVoting.vaults.map((vault) => vault.address),
      );
      const gscStatus = gscVoting
        ? await getFormattedGSCStatus(address as string, gscVoting)
        : null;

      return {
        votingHistory: votingHistory as Vote[],
        votingPower,
        gscStatus,
      };
    },
    {
      enabled: !!address && !!votingHistory,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
}
