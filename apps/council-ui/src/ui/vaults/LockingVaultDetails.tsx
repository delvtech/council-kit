import { LockingVault } from "@council/sdk";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import assertNever from "assert-never";
import { ethers, Signer } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { ReactElement } from "react";
import toast from "react-hot-toast";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { Progress } from "src/ui/base/Progress";
import { useCouncil } from "src/ui/council/useCouncil";
import { useSigner } from "wagmi";
import { ChangeDelegateForm } from "./base/ChangeDelegateForm";
import { DepositAndWithdrawForm } from "./base/DepositAndWithdrawForm";

interface LockingVaultDetailsProps {
  address: string;
  account: string;
}

export function LockingVaultDetails({
  address,
  account,
}: LockingVaultDetailsProps): ReactElement {
  const { data: signer } = useSigner();
  const { data, status, error } = useLockingVaultDetailsData(address, account);
  const { mutate: changeDelegate } = useChangeDelegate(address);
  const { mutate: deposit } = useDeposit(address);
  const { mutate: withdraw } = useWithdraw(address);
  const { mutate: approve } = useApprove(address);
  switch (status) {
    case "loading":
      return (
        <div className="flex flex-col items-center gap-8 ">
          <Progress />
        </div>
      );

    case "error":
      return (
        <div className="daisy-mockup-code">
          <code className="block whitespace-pre-wrap px-6 text-error">
            {error ? (error as any).toString() : "Unknown error"}
          </code>
        </div>
      );

    case "success":
      return (
        <div className="flex h-48 w-full flex-col gap-x-8 sm:flex-row">
          <DepositAndWithdrawForm
            symbol={data.tokenSymbol}
            balance={data.tokenBalance}
            allowance={data.tokenAllowance}
            depositedBalance={data.depositedBalance}
            disabled={!signer}
            onApprove={() => approve({ signer: signer as Signer })}
            onDeposit={(amount) =>
              deposit({ signer: signer as Signer, amount })
            }
            onWithdraw={(amount) =>
              withdraw({ signer: signer as Signer, amount })
            }
          />
          <ChangeDelegateForm
            currentDelegate={data.delegate}
            disabled={!signer}
            onDelegate={(delegate) =>
              changeDelegate({ signer: signer as Signer, delegate })
            }
          />
        </div>
      );

    default:
      assertNever(status);
  }
}

interface LockingVaultDetailsData {
  tokenSymbol: string;
  tokenBalance: string;
  tokenAllowance: string;
  depositedBalance: string;
  delegate: string;
}

function useLockingVaultDetailsData(
  address: string,
  account: string,
): UseQueryResult<LockingVaultDetailsData> {
  const { context } = useCouncil();
  return useQuery({
    queryKey: ["lockingVaultDetails", address, account],
    queryFn: async () => {
      const lockingVault = new LockingVault(address, context);
      const token = await lockingVault.getToken();
      const delegate = await lockingVault.getDelegate(account);
      return {
        tokenSymbol: await token.getSymbol(),
        tokenBalance: await token.getBalanceOf(account),
        tokenAllowance: await token.getAllowance(account, address),
        depositedBalance: await lockingVault.getDepositedBalance(account),
        delegate: delegate.address,
      };
    },
  });
}

interface ApproveArguments {
  signer: Signer;
}

function useApprove(vaultAddress: string) {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({ signer }: ApproveArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      const token = await vault.getToken();
      const decimals = await token.getDecimals();
      return token.approve(
        signer,
        vault.address,
        formatUnits(ethers.constants.MaxUint256, decimals),
        {
          onSubmitted: () => (toastId = toast.loading("Approving")),
        },
      );
    },
    {
      onSuccess: () => {
        toast.success(`Successfully approved!`, {
          id: toastId,
        });
        queryClient.invalidateQueries();
      },
      onError(error) {
        toast.error(`Failed to approve`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}

interface DepositAndWithdrawArguments {
  signer: Signer;
  amount: string;
}

function useDeposit(vaultAddress: string) {
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

function useWithdraw(vaultAddress: string) {
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

function useChangeDelegate(vaultAddress: string) {
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
