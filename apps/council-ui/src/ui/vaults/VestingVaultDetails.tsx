import { VestingVault } from "@council/sdk";
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
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { ChangeDelegateForm } from "src/ui/vaults/base/ChangeDelegateForm";
import VaultHeader from "src/ui/vaults/base/VaultHeader";
import { useAccount, useSigner } from "wagmi";
import { GrantCard } from "./vesting/GrantCard";

interface VestingVaultDetailsProps {
  address: string;
}

export function VestingVaultDetails({
  address,
}: VestingVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data: signer } = useSigner();
  const { data, status, error } = useVestingVaultDetailsData(
    address,
    "0x0907742ce0a894b6a5d70e9df2c8d2fadcaf4039",
  );
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

          <div className="flex flex-wrap gap-4">
            {data.activeProposalCount >= 0 && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">Active Proposals</div>
                  <div className="daisy-stat-value text-sm">
                    {data.activeProposalCount}
                  </div>
                </div>
              </div>
            )}

            {data.accountVotingPower && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">Your Voting Power</div>
                  <div className="daisy-stat-value text-sm">
                    {formatBalance(data.accountVotingPower)}
                  </div>
                </div>
              </div>
            )}

            {data.accountPercentOfTVP >= 0 && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">% of Total TVP</div>
                  <div className="daisy-stat-value text-sm">
                    {formatBalance(data.accountPercentOfTVP, 2)}%
                  </div>
                </div>
              </div>
            )}

            {data.delegatedToAccount >= 0 && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">Delegated to You</div>
                  <div className="daisy-stat-value text-sm">
                    {data.delegatedToAccount}
                  </div>
                </div>
              </div>
            )}

            {data.participants >= 0 && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">Participants</div>
                  <div className="daisy-stat-value text-sm">
                    {data.participants}
                  </div>
                </div>
              </div>
            )}
            <div className="daisy-stats">
              <div className="daisy-stat bg-base-300">
                <div className="daisy-stat-title">Vault token</div>
                <div className="daisy-stat-value text-sm">
                  <ExternalLink
                    href={makeEtherscanAddressURL(data.tokenAddress)}
                  >
                    {data.tokenSymbol}
                  </ExternalLink>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-48 w-full flex-col gap-8 sm:flex-row">
            <div className="basis-1/2">
              <GrantCard
                vestingVaultAddress={address}
                grantBalance={data.grantBalance}
                grantBalanceWithdrawn={data.grantBalanceWithdrawn}
                creationDate={data.creationDate}
                expirationDate={data.expirationDate}
                unlockDate={data.unlockDate}
              />
            </div>
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
  delegatedToAccount: number;
  descriptionURL: string | undefined;
  expirationDate: Date;
  creationDate: Date;
  grantBalance: string;
  grantBalanceWithdrawn: string;
  name: string | undefined;
  participants: number;
  tokenAddress: string;
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
  const coreVotingConfig = councilConfigs[chainId].coreVoting;
  const vaultConfig = coreVotingConfig.vaults.find(
    (vault) => vault.address === address,
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
        tokenAddress: token.address,
        tokenSymbol: await token.getSymbol(),
        tokenBalance: await token.getBalanceOf(account as string),
        // TODO: Confirm this is accurate.
        grantBalance: grant.allocation,
        grantBalanceWithdrawn: grant.withdrawn,
        creationDate: new Date(grant.createdTimestamp),
        unlockDate: new Date(grant.unlockTimestamp),
        expirationDate: new Date(grant.expirationTimestamp),
        delegate: (await vestingVault.getDelegate(account as string)).address,
        descriptionURL: vaultConfig?.descriptionURL,
        name: vaultConfig?.name,
        accountVotingPower,
        participants: (await vestingVault.getVoters()).length,
        delegatedToAccount: (
          await vestingVault.getDelegatorsTo(account as string)
        ).length,
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
