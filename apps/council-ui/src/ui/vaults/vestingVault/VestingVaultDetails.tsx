import { getBlockDate, VestingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { assertNever } from "assert-never";
import { Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { makeEtherscanAddressURL } from "src/etherscan/makeEtherscanAddressURL";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { ChangeDelegateForm } from "src/ui/vaults/ChangeDelegateForm";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { GrantCard } from "src/ui/vaults/vestingVault/GrantCard";
import { useChangeDelegate } from "src/ui/vaults/vestingVault/hooks/useChangeDelegate";
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

  const hasGrant = parseUnits(
    data?.grantBalance || "0",
    data?.tokenDecimals,
  ).gt(0);

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
                  <div className="text-sm daisy-stat-value">
                    {data.activeProposalCount}
                  </div>
                </div>
              </div>
            )}

            {data.accountVotingPower && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">Your Voting Power</div>
                  <div className="text-sm daisy-stat-value">
                    {formatBalance(data.accountVotingPower)}
                  </div>
                </div>
              </div>
            )}

            {data.delegatedToAccount >= 0 && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">Delegated to You</div>
                  <div className="text-sm daisy-stat-value">
                    {data.delegatedToAccount}
                  </div>
                </div>
              </div>
            )}

            {data.participants >= 0 && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">Participants</div>
                  <div className="text-sm daisy-stat-value">
                    {data.participants}
                  </div>
                </div>
              </div>
            )}
            <div className="daisy-stats">
              <div className="daisy-stat bg-base-300">
                <div className="daisy-stat-title">Vault token</div>
                <div className="text-sm daisy-stat-value">
                  <ExternalLink
                    href={makeEtherscanAddressURL(data.tokenAddress)}
                  >
                    {data.tokenSymbol}
                  </ExternalLink>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full h-48 gap-8 sm:flex-row">
            <div className="basis-1/2">
              <GrantCard
                vestingVaultAddress={address}
                grantBalance={data.grantBalance}
                grantBalanceWithdrawn={data.grantBalanceWithdrawn}
                expirationDate={data.expirationDate}
                unlockDate={data.unlockDate}
              />
            </div>
            {hasGrant ? (
              <ChangeDelegateForm
                currentDelegate={data.delegate}
                disabled={!signer || !!data.accountVotingPower}
                onDelegate={(delegate) =>
                  changeDelegate({ signer: signer as Signer, delegate })
                }
              />
            ) : null}
          </div>
        </Page>
      );

    default:
      assertNever(status);
  }
}

interface VestingVaultDetailsData {
  accountVotingPower: string;
  activeProposalCount: number;
  delegate: string;
  delegatedToAccount: number;
  descriptionURL: string | undefined;
  expirationDate: Date | null;
  grantBalance: string;
  grantBalanceWithdrawn: string;
  name: string | undefined;
  participants: number;
  tokenAddress: string;
  tokenBalance: string;
  tokenSymbol: string;
  tokenDecimals: number;
  unlockDate: Date | null;
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
    queryFn: async (): Promise<VestingVaultDetailsData> => {
      const vestingVault = new VestingVault(address, context);
      const token = await vestingVault.getToken();
      const tokenDecimals = await token.getDecimals();
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
        tokenDecimals,
        tokenBalance: await token.getBalanceOf(account as string),
        grantBalance: grant.allocation,
        grantBalanceWithdrawn: grant.withdrawn,
        unlockDate: await getBlockDate(grant.unlockBlock, context.provider, {
          estimateFutureDates: true,
        }),
        expirationDate: await getBlockDate(
          grant.expirationBlock,
          context.provider,
          {
            estimateFutureDates: true,
          },
        ),
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
