import { Hash } from "@delvtech/drift";
import {
  MutationStatus,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSubmittedToast } from "src/ui/base/toast/makeTransactionSubmittedToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { usePublicClient } from "wagmi";

/**
 * A hook which takes a write function that returns a transaction hash and wraps
 * it with unified logic for:
 *
 * - Waiting for the transaction to be mined
 * - Showing toast notifications for transaction status
 * - Invalidating queries on success
 */
export function useWrite<TFunction extends (args: any) => Promise<Hash>>({
  writeFn,
  pendingMessage = "Transaction pending...",
  successMessage = "Transaction successful!",
  errorMessage = "Transaction failed.",
}: {
  writeFn: TFunction | undefined;
  pendingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}): {
  write: TFunction | undefined;
  status: MutationStatus;
  transactionHash: Hash | undefined;
} {
  const [transactionHash, setTransactionHash] = useState<Hash>();
  const chainId = useSupportedChainId();
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const { mutate, status } = useMutation({
    mutationFn: writeFn
      ? async (args: Parameters<TFunction>[0]) => {
          const hash = await writeFn(args);
          setTransactionHash(hash);
          makeTransactionSubmittedToast(pendingMessage, hash, chainId);
          await publicClient?.waitForTransactionReceipt({ hash });
          return hash;
        }
      : undefined,
    onSuccess: (hash) => {
      makeTransactionSuccessToast(successMessage, hash, chainId);
      // All query cache can be invalidated. The SDK uses it's own cache which
      // has built-in invalidation logic based on the methods called.
      queryClient.invalidateQueries();
    },
    onError(error) {
      makeTransactionErrorToast(errorMessage, transactionHash, chainId);
      console.error(error);
    },
  });

  return {
    write: mutate as TFunction,
    status,
    transactionHash,
  };
}
