import { GSCVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSubmittedToast } from "src/ui/base/toast/makeTransactionSubmittedToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { getCoreVotingVaults } from "src/vaults/vaults";

interface JoinGSCOptions {
  signer: Signer;
}
export function useJoinGSC(
  gscVaultAddress: string,
): UseMutationResult<string, unknown, JoinGSCOptions> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  const chainId = useChainId();
  const coreVotingVaultAddresses = getCoreVotingVaults(chainId).map(
    ({ address }) => address,
  );
  let transactionHash: string;

  return useMutation({
    mutationFn: ({ signer }: JoinGSCOptions): Promise<string> => {
      const gscVault = new GSCVault(gscVaultAddress, context);
      return gscVault.join(signer, coreVotingVaultAddresses, {
        onSubmitted: (hash) => {
          makeTransactionSubmittedToast(
            "Transaction submitted to join the GSC...",
            hash,
          );
          transactionHash = hash;
        },
      });
    },
    onSuccess: (hash) => {
      makeTransactionSuccessToast("Successfully joined the GSC!", hash);
      queryClient.invalidateQueries();
    },
    onError(error) {
      makeTransactionErrorToast(
        "Failed to join the GSC. Please make sure you have the requisite voting power to become a member first.",
        transactionHash,
      );
      console.error(error);
    },
  });
}
