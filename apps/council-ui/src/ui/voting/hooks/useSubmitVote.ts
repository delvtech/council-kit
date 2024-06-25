import { Ballot, ReadVotingVault } from "@delvtech/council-viem";
import { MutationStatus } from "@tanstack/react-query";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

interface SubmitVoteOptions {
  coreVotingAddress: `0x${string}`;
  proposalId: bigint;
  ballot: Ballot;
  vaults: (ReadVotingVault | `0x${string}`)[];
}

export function useSubmitVote(): {
  submitVote: ((options: SubmitVoteOptions) => void) | undefined;
  transactionHash: `0x${string}` | undefined;
  status: MutationStatus;
} {
  const council = useReadWriteCouncil();
  const enabled = !!council;

  const { write, status, transactionHash } = useWrite({
    pendingMessage: "Submitting vote...",
    successMessage: "Vote submitted!",
    errorMessage: "Failed to submit vote.",
    writeFn: async ({
      coreVotingAddress,
      proposalId,
      ballot,
      vaults,
    }: SubmitVoteOptions) => {
      if (!enabled) {
        throw new Error(
          "Connection to council not available. Check your wallet connection.",
        );
      }

      const coreVoting = council.coreVoting({ address: coreVotingAddress });
      const proposal = await coreVoting.getProposal({
        id: proposalId,
      });

      if (!proposal) {
        throw new Error(
          `Attempted to vote on proposal ${proposalId} from ${coreVotingAddress}, but it does not exist.`,
        );
      }

      return proposal.vote({ ballot, vaults });
    },
  });

  return {
    submitVote: enabled ? write : undefined,
    transactionHash,
    status,
  };
}
