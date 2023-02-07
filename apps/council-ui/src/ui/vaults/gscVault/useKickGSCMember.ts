import { GSCVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSubmittedToast } from "src/ui/base/toast/makeTransactionSubmittedToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";

interface KickGSCMemberOptions {
  signer: Signer;
  memberAddress: string;
}
export function useKickGSCMember(
  gscVaultAddress: string,
): UseMutationResult<string, unknown, KickGSCMemberOptions> {
  const { context } = useCouncil();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  let transactionHash: string;

  return useMutation({
    mutationFn: ({
      signer,
      memberAddress,
    }: KickGSCMemberOptions): Promise<string> => {
      const gscVault = new GSCVault(gscVaultAddress, context);
      return gscVault.kick(signer, memberAddress, {
        onSubmitted: (hash) => {
          makeTransactionSubmittedToast(
            `Kicking GSC Member: ${formatAddress(memberAddress)}`,
            hash,
            chainId,
          );
          transactionHash = hash;
        },
      });
    },
    onSuccess: (hash, { memberAddress }) => {
      makeTransactionSuccessToast(
        `Successfully kicked ${formatAddress(memberAddress)} from the GSC!`,
        hash,
        chainId,
      );
      queryClient.invalidateQueries();
    },
    onError(error, { memberAddress }) {
      makeTransactionErrorToast(
        `Failed to kick ${formatAddress(memberAddress)} from the GSC.`,
        transactionHash,
        chainId,
      );
      console.error(error);
    },
  });
}
