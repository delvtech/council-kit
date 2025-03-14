import { Ballot } from "@delvtech/council-js";
import { Address, Bytes } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { useWrite } from "src/ui/contract/useWrite";
import { useReadWriteCouncil } from "src/ui/council/useReadWriteCouncil";

export interface useSubmitVoteOptions {
  votingContract: Address;
  proposalId: bigint;
  vaults: Address[];
  extraVaultData?: Bytes[];
  chainId?: SupportedChainId;
}

export function useSubmitVote({
  chainId,
  votingContract,
  proposalId,
  extraVaultData,
  vaults,
}: useSubmitVoteOptions) {
  const council = useReadWriteCouncil({ chainId });
  const enabled = !!council;

  return useWrite({
    pendingMessage: "Submitting vote...",
    successMessage: "Vote submitted!",
    errorMessage: "Failed to submit vote.",
    writeFn: enabled
      ? async (ballot: Ballot) => {
          return council.coreVoting(votingContract).vote({
            args: {
              proposalId,
              ballot,
              vaults,
              extraVaultData,
            },
          });
        }
      : undefined,
  });
}
