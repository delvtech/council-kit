import { LockingVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import toast from "react-hot-toast";
import { useCouncil } from "src/ui/council/useCouncil";

interface WithdrawArguments {
  signer: Signer;
  amount: string;
}

export function useWithdraw(
  vaultAddress: string,
): UseMutationResult<string, unknown, WithdrawArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({ signer, amount }: WithdrawArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      return vault.withdraw(signer, amount, {
        onSubmitted: () => (toastId = toast.loading("Withdrawing")),
      });
    },
    {
      onSuccess: (_, { amount }) => {
        toast.success(`Successfully withdrew ${amount}!`, {
          id: toastId,
        });
        queryClient.invalidateQueries();
      },
      onError(error, { amount }) {
        toast.error(`Failed to withdraw ${amount}`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}
