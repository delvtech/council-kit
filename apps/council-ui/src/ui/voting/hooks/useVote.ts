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

export function useVote(): UseMutationResult<
  string,
  unknown,
  VoteArguments,
  unknown
> {
  const { coreVoting } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({ signer, proposalId, ballot }: VoteArguments) => {
      const proposal = coreVoting.getProposal(proposalId);
      return proposal.vote(signer, ballot, {
        onSubmitted: () => (toastId = toast.loading("Voting")),
      });
    },
    {
      onSuccess: (_, { proposalId, ballot }) => {
        toast.success(
          `Successfully voted ${ballot} on Proposal ${proposalId}!`,
          {
            id: toastId,
          },
        );
        queryClient.invalidateQueries();
      },
      onError: (error, { proposalId, ballot }) => {
        toast.success(`Failed to vote ${ballot} on Proposal ${proposalId}.`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}
