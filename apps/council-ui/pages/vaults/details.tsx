import { LockingVault, VestingVault, VotingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { councilConfigs, SupportedChainId } from "src/config/council.config";
import { VaultConfig } from "src/config/CouncilConfig";
import { chains } from "src/provider";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { LockingVaultDetails } from "src/ui/vaults/LockingVaultDetails";
import { VestingVaultDetails } from "src/ui/vaults/VestingVaultDetails";
import { useAccount, useNetwork } from "wagmi";

export default function Vault(): ReactElement {
  const { address: account } = useAccount();
  const { query } = useRouter();
  const { data, isLoading, isError, error } = useVaultDetailsData(
    query.address as string,
    account,
  );
  return (
    <Page>
      {isError ? (
        <div className="daisy-mockup-code">
          <code className="block whitespace-pre-wrap px-6 text-error">
            {error ? (error as any).toString() : "Unknown error"}
          </code>
        </div>
      ) : isLoading ? (
        <progress className="daisy-progress m-auto w-56 items-center"></progress>
      ) : (
        <>
          {/* Page Header */}
          <div>
            {data.descriptionURL ? (
              <a href={data.descriptionURL} target="_blank" rel="noreferrer">
                <h1 className="text-5xl text-accent-content">{data.name}</h1>
              </a>
            ) : (
              <h1 className="text-5xl text-accent-content">{data.name}</h1>
            )}
          </div>

          {/* Statistics Row */}
          <div className="flex flex-wrap gap-4">
            {typeof data.activeProposalCount === "number" && (
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

            {typeof data.accountPercentOfTVP === "number" && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">% of Total TVP</div>
                  <div className="daisy-stat-value text-sm">
                    {formatBalance(data.accountPercentOfTVP, 2)}%
                  </div>
                </div>
              </div>
            )}

            {typeof data.delegatedToAccount === "number" && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">Delegated to You</div>
                  <div className="daisy-stat-value text-sm">
                    {data.delegatedToAccount}
                  </div>
                </div>
              </div>
            )}

            {typeof data.participants === "number" && (
              <div className="daisy-stats">
                <div className="daisy-stat bg-base-300">
                  <div className="daisy-stat-title">Participants</div>
                  <div className="daisy-stat-value text-sm">
                    {data.participants}
                  </div>
                </div>
              </div>
            )}
          </div>

          {account &&
            query.address &&
            (() => {
              switch (data.type) {
                case "LockingVault":
                  return (
                    <LockingVaultDetails
                      account={account}
                      address={query.address as string}
                    />
                  );

                case "VestingVault":
                  return (
                    <VestingVaultDetails
                      account={account}
                      address={query.address as string}
                    />
                  );

                case "GSCVault":
                  return <></>;

                case undefined:
                  return <></>;

                default:
                  assertNever(data.type);
              }
            })()}
        </>
      )}
    </Page>
  );
}

interface VaultDetailsData {
  name: string;
  type?: VaultConfig["type"];
  descriptionURL?: string;
  activeProposalCount?: number;
  accountVotingPower?: string;
  accountPercentOfTVP?: number;
  delegatedToAccount?: number;
  participants?: number;
}

function useVaultDetailsData(
  address: string,
  account: string | undefined,
): UseQueryResult<VaultDetailsData> {
  const { context, coreVoting, gscVoting } = useCouncil();
  const { chain } = useNetwork();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery({
    queryKey: ["vaultDetails", address, account, chainId],
    queryFn: async () => {
      const config = councilConfigs[chainId as SupportedChainId];

      let vault = coreVoting.vaults.find((vault) => vault.address === address);
      let votingContract = vault && coreVoting;
      let votingContractConfig = vault && config.coreVoting;

      if (!vault && gscVoting && gscVoting?.vaults[0].address === address) {
        votingContract = gscVoting;
        vault = gscVoting.vaults[0];
        votingContractConfig = config.gscVoting;
      }

      if (!vault) {
        vault = new VotingVault(address, context);
      }

      let delegatedToAccount: number | undefined;
      if (
        account &&
        (vault instanceof LockingVault || vault instanceof VestingVault)
      ) {
        delegatedToAccount = (await vault.getDelegatorsTo(account)).length;
      }

      let activeProposalCount: number | undefined;
      const proposals = await votingContract?.getProposals();
      if (proposals) {
        activeProposalCount = 0;
        for (const proposal of proposals) {
          if (await proposal.getIsActive()) {
            activeProposalCount++;
          }
        }
      }

      const type =
        votingContractConfig &&
        votingContractConfig.vaults.find(
          (vaultConfig) => vaultConfig.address === address,
        )?.type;
      const accountVotingPower =
        account && (await vault.getVotingPower(account));

      return {
        name: vault.name,
        type,
        descriptionURL: votingContractConfig?.vaults.find(
          (vault) => vault.address === address,
        )?.descriptionURL,
        activeProposalCount,
        accountVotingPower,
        accountPercentOfTVP:
          accountVotingPower && vault.getTotalVotingPower
            ? (+accountVotingPower / +(await vault.getTotalVotingPower())) * 100
            : undefined,
        delegatedToAccount,
        participants: vault.getVoters && (await vault.getVoters()).length,
      };
    },
  });
}
