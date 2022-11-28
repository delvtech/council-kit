import { sumStrings, VestingVault } from "@council/sdk";
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

interface VestingVaultDetailsProps {
  address: string;
  account: string;
}

export function VestingVaultDetails({
  address,
  account,
}: VestingVaultDetailsProps): ReactElement {
  const { data: signer } = useSigner();
  const { data, status, error } = useVestingVaultDetailsData(address, account);
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
          <div className="basis-1/2">{/* TODO */}</div>
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

interface VestingVaultDetailsData {
  tokenSymbol: string;
  tokenBalance: string;
  grantBalance: string;
  unlockDate: Date;
  expirationDate: Date;
  delegate: string;
}

function useVestingVaultDetailsData(
  address: string,
  account: string,
): UseQueryResult<VestingVaultDetailsData> {
  const { context } = useCouncil();
  return useQuery(["vestingVaultDetails", address, account], async () => {
    const vestingVault = new VestingVault(address, context);
    const token = await vestingVault.getToken();
    const grant = await vestingVault.getGrant(account);
    return {
      tokenSymbol: await token.getSymbol(),
      tokenBalance: await token.getBalanceOf(account),
      // TODO: Confirm this is accurate.
      grantBalance: sumStrings([grant.allocation, `-${grant.withdrawn}`]),
      unlockDate: new Date(grant.unlockTimestamp),
      expirationDate: new Date(grant.expirationTimestamp),
      delegate: (await vestingVault.getDelegate(account)).address,
    };
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
      const vault = new VestingVault(vaultAddress, context);
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
        queryClient.refetchQueries();
      },
      onError(error, { delegate }) {
        toast.error(`Failed to delegate to ${formatAddress(delegate)}!`, {
          id: toastId,
        });
        console.error(new Error((error as any).toString()));
      },
    },
  );
}
