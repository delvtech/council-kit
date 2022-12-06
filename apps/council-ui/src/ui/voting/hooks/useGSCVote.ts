import { Ballot } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import toast from "react-hot-toast";
import { useCouncil } from "src/ui/council/useCouncil";

interface VoteArguments {
  signer: Signer;
  proposalId: number;
  ballot: Ballot;
}

export function useGSCVote(): UseMutationResult<
  string,
  unknown,
  VoteArguments,
  unknown
> {
  const { gscVoting } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({ signer, proposalId, ballot }: VoteArguments) => {
      if (!gscVoting) {
        throw new Error(
          `Attempted to vote on GSC proposal ${proposalId}, but no config was found for GSC. See src/config.`,
        );
      }
      const proposal = gscVoting.getProposal(proposalId);
      return proposal.vote(signer, ballot, {
        onSubmitted: () => (toastId = toast.loading("Voting")),
      });
    },
    {
      onSuccess: (_, { proposalId, ballot }) => {
        toast.success(
          // safe to cast since it won't reach this callback if proposal is undefined.
          `Successfully voted ${ballot} on GSC Proposal ${proposalId}!`,
          {
            id: toastId,
          },
        );
        queryClient.invalidateQueries();
      },

      onError: (error, { proposalId, ballot }) => {
        toast.success(
          `Failed to vote ${ballot} on GSC Proposal ${proposalId}}.`,
          {
            id: toastId,
          },
        );
        console.error(error);
      },
    },
  );
}
