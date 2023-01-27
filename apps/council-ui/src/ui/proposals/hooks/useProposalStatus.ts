import { Proposal } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

export type ProposalStatus =
  | "UNKNOWN"
  | "IN PROGRESS"
  | "EXPIRED"
  | "FAILED"
  | "EXECUTED";

export function useProposalStatus(
  currentQuorum: string,
  requiredQuorum: string | null,
  votingEnds: Date | null,
  proposalId: number,
): UseQueryResult<ProposalStatus> {
  const { context, coreVoting } = useCouncil();

  return useQuery({
    queryKey: ["proposal-status", proposalId],
    queryFn: async (): Promise<ProposalStatus> => {
      const proposal = new Proposal(proposalId, coreVoting, context);
      const isExecuted = await proposal.getIsExecuted();

      if (isExecuted) {
        return "EXECUTED";
      }

      if (!votingEnds || !requiredQuorum) {
        return "UNKNOWN";
      }

      const currentDate = new Date();
      if (currentDate > votingEnds) {
        if (+currentQuorum >= +requiredQuorum) {
          return "EXPIRED";
        } else {
          return "FAILED";
        }
      }

      return "IN PROGRESS";
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
