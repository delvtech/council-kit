import { LockingVault } from "@council/sdk";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import assertNever from "assert-never";
import { Signer } from "ethers";
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
            depositedBalance={data.depositedBalance}
            disabled={!signer}
            onDeposit={() => {}} // TODO
            onWithdraw={() => {}} // TODO
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
        depositedBalance: await lockingVault.getDepositedBalance(account),
        delegate: delegate.address,
      };
    },
  });
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
        // The SDK will manage cache invalidation for us ✨
        queryClient.invalidateQueries();
      },
      onError(error, { delegate }) {
        toast.error(`Failed to delegate to ${formatAddress(delegate)}!`, {
          id: toastId,
        });
        // Wrapping in new Error() to get stack trace
        console.error(new Error((error as any).toString()));
      },
    },
  );
}
