import { sumStrings, VestingVault } from "@council/sdk";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { assertNever } from "assert-never";
import { Signer } from "ethers";
import { ReactElement } from "react";
import index from "react-hot-toast";
import { councilConfigs } from "src/config/council.config";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { ChangeDelegateForm } from "src/ui/vaults/base/ChangeDelegateForm";
import VaultHeader from "src/ui/vaults/base/VaultHeader";
import { useVaultConfig } from "src/ui/vaults/hooks/useVaultConfig";
import { useAccount, useSigner } from "wagmi";

interface VestingVaultDetailsProps {
  address: string;
}

export function VestingVaultDetails({
  address,
}: VestingVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data: signer } = useSigner();
  const { data, status, error } = useVestingVaultDetailsData(address, account);
  const { mutate: changeDelegate } = useChangeDelegate(address);
  switch (status) {
    case "loading":
      return (
        <div className="flex flex-col items-center gap-8 mt-48">
          <p>Loading Locking Vault data. This might take a while...</p>
          <Progress />
        </div>
      );

    case "error":
      return <ErrorMessage error={error} />;

    case "success":
      return (
        <Page>
          <VaultHeader name={data.name} descriptionURL={data.descriptionURL} />

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
        </Page>
      );

    default:
      assertNever(status);
  }
}

interface VestingVaultDetailsData {
  accountPercentOfTVP: number;
  accountVotingPower: string;
  activeProposalCount: number;
  delegate: string;
  descriptionURL: string | undefined;
  expirationDate: Date;
  grantBalance: string;
  name: string | undefined;
  participants: number;
  tokenBalance: string;
  tokenSymbol: string;
  unlockDate: Date;
}

function useVestingVaultDetailsData(
  address: string,
  account: string | undefined,
): UseQueryResult<VestingVaultDetailsData> {
  const { context, coreVoting } = useCouncil();

  const chainId = useChainId();
  const vaultConfig = useVaultConfig(
    address,
    councilConfigs[chainId].coreVoting,
  );

  return useQuery({
    queryKey: ["vestingVaultDetails", address, account],
    enabled: !!account,
    queryFn: async () => {
      const vestingVault = new VestingVault(address, context);
      const token = await vestingVault.getToken();
      const grant = await vestingVault.getGrant(account as string);

      const accountVotingPower = await vestingVault.getVotingPower(
        account as string,
      );

      let activeProposalCount = 0;
      const proposals = await coreVoting.getProposals();
      for (const proposal of proposals) {
        if (await proposal.getIsActive()) {
          activeProposalCount++;
        }
      }

      return {
        tokenSymbol: await token.getSymbol(),
        tokenBalance: await token.getBalanceOf(account as string),
        // TODO: Confirm this is accurate.
        grantBalance: sumStrings([grant.allocation, `-${grant.withdrawn}`]),
        unlockDate: new Date(grant.unlockTimestamp),
        expirationDate: new Date(grant.expirationTimestamp),
        delegate: (await vestingVault.getDelegate(account as string)).address,
        descriptionURL: vaultConfig?.descriptionURL,
        name: vaultConfig?.name,
        accountVotingPower,
        participants: (await vestingVault.getVoters()).length,
        delegatedToAccount: await vestingVault.getDelegatorsTo(
          account as string,
        ),
        activeProposalCount,
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
      const vault = new VestingVault(vaultAddress, context);
      return vault.changeDelegate(signer, delegate, {
        onSubmitted: () => (toastId = index.loading("Delegating")),
      });
    },
    {
      onSuccess: (_, { delegate }) => {
        index.success(`Successfully delegated to ${formatAddress(delegate)}!`, {
          id: toastId,
        });
        // The SDK will manage cache invalidation for us ✨
        queryClient.invalidateQueries();
      },
      onError(error, { delegate }) {
        index.error(`Failed to delegate to ${formatAddress(delegate)}!`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}
