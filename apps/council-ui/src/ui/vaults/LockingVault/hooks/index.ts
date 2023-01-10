import { LockingVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import toast from "react-hot-toast";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useCouncil } from "src/ui/council/useCouncil";

interface DepositAndWithdrawArguments {
  signer: Signer;
  amount: string;
}

export function useDeposit(
  vaultAddress: string,
): UseMutationResult<string, unknown, DepositAndWithdrawArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({
      signer,
      amount,
    }: DepositAndWithdrawArguments): Promise<string> => {
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

export function useWithdraw(
  vaultAddress: string,
): UseMutationResult<string, unknown, DepositAndWithdrawArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({
      signer,
      amount,
    }: DepositAndWithdrawArguments): Promise<string> => {
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

interface ChangeDelegateArguments {
  signer: Signer;
  delegate: string;
}

export function useChangeDelegate(
  vaultAddress: string,
): UseMutationResult<string, unknown, ChangeDelegateArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    ({ signer, delegate }: ChangeDelegateArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      return vault.changeDelegate(signer, delegate, {
        onSubmitted: () => (toastId = toast.loading("Delegating")),
      });
    },
    {
      onSuccess: (_, { delegate }) => {
        toast.success(`Successfully delegated to ${formatAddress(delegate)}!`, {
          id: toastId,
        });
        queryClient.invalidateQueries();
      },
      onError(error, { delegate }) {
        toast.error(`Failed to delegate to ${formatAddress(delegate)}`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}
