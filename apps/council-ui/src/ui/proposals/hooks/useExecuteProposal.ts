import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { useWrite } from "src/ui/contract/useWrite";
import { useReadWriteCouncil } from "src/ui/council/useReadWriteCouncil";

export interface useExecuteProposalOptions {
  votingContract: Address;
  proposalId: bigint;
  chainId?: SupportedChainId;
}

export function useExecuteProposal({
  votingContract,
  proposalId,
  chainId,
}: useExecuteProposalOptions) {
  const council = useReadWriteCouncil({ chainId });
  const enabled = !!council;

  return useWrite({
    pendingMessage: "Executing proposal...",
    successMessage: "Proposal executed!",
    errorMessage: "Failed to execute proposal.",
    writeFn: enabled
      ? async () => {
          return council.coreVoting(votingContract).executeProposal({
            args: { proposalId },
          });
        }
      : undefined,
  });
}
