import { CappedFrozenLockingVault__factory } from "@council/typechain";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";

interface SendFundsArguments {
  signer: Signer;
}

export function useSendFunds(
  vaultAddress: string,
): UseMutationResult<string, unknown, SendFundsArguments> {
  const { context } = useCouncil();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  let transactionHash: string;
  return useMutation(
    async ({ signer }: SendFundsArguments): Promise<string> => {
      const vault = CappedFrozenLockingVault__factory.connect(
        vaultAddress,
        signer,
      );
      const tx = await vault.sendTotal();
      return tx.hash;
    },
    {
      onSuccess: (hash) => {
        makeTransactionSuccessToast(
          `Successfully sent all funds!`,
          hash,
          chainId,
        );
        queryClient.invalidateQueries();
      },
      onError(error) {
        makeTransactionErrorToast(
          `Failed to send all funds`,
          transactionHash,
          chainId,
        );
        console.error(error);
      },
    },
  );
}
