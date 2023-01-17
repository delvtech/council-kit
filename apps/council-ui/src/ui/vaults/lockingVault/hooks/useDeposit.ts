import { LockingVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import toast from "react-hot-toast";
import { useCouncil } from "src/ui/council/useCouncil";

interface DepositArguments {
  signer: Signer;
  amount: string;
}

export function useDeposit(
  vaultAddress: string,
): UseMutationResult<string, unknown, DepositArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({ signer, amount }: DepositArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      const account = await signer.getAddress();
      return vault.deposit(signer, account, amount, account, {
        onSubmitted: () => (toastId = toast.loading("Depositing")),
      });
    },
    {
      onSuccess: (_, { amount }) => {
        toast.success(`Successfully deposited ${amount}!`, {
          id: toastId,
        });
        queryClient.invalidateQueries();
      },
      onError(error, { amount }) {
        toast.error(`Failed to deposit ${amount}`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}
