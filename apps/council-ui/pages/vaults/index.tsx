import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { VaultConfig } from "src/config/CouncilConfig";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import {
  GenericVaultCard,
  GenericVaultCardSkeleton,
} from "src/ui/vaults/GenericVaultCard";
import { GSCVaultPreviewCard } from "src/ui/vaults/gscVault/GSCVaultPreviewCard/GSCVaultPreviewCard";
import { getAllVaultConfigs } from "src/vaults/vaults";
import { useAccount } from "wagmi";

export default function VaultsPage(): ReactElement {
  const { address } = useAccount();
  const { data, status } = useVaultsPageData(address);

  return (
    <Page>
      <div className="px-4">
        <h1 className="text-5xl font-bold">Voting Vaults</h1>
        <p className="mt-6 text-lg">
          Voting Vaults enable Element DAO to make governance participation more
          inclusive and capital efficient. Vaults can be created by defining
          strategies for assigning voting power to different use cases and
          getting them voted in and accepted.
        </p>
      </div>

      <div className="grid grid-cols-1 grid-flow-row gap-6 md:grid-cols-2 lg:grid-cols-3">
        {status === "success" ? (
          data.map((vault) => {
            switch (vault.name) {
              case "GSC Vault":
                return (
                  <GSCVaultPreviewCard
                    key={vault.address}
                    vaultAddress={vault.address}
                  />
                );

              case "Locking Vault":
              case "Vesting Vault":
              default:
                return (
                  <GenericVaultCard
                    key={vault.address}
                    address={vault.address}
                    name={vault.name}
                    tvp={vault.tvp}
                    votingPower={vault.votingPower}
                    sentenceSummary={vault.sentenceSummary}
                  />
                );
            }
          })
        ) : (
          <>
            <GenericVaultCardSkeleton />
            <GenericVaultCardSkeleton />
            <GenericVaultCardSkeleton />
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-2 sm:flex-nowrap">
        <ExternalInfoCard
          header="Learn more about voting vaults"
          body="Check out this blog post to learn about various types of Voting
          Vaults available today and how this governance primitive can be
          extended to serve many more use cases."
          href="https://blog.element.fi/voting-vaults-a-new-defi-and-governance-primitive-2/"
        />
        <ExternalInfoCard
          header="Want to dive deeper? Read the docs."
          body="Learn about the mechanics behind the current vault types,
          details on the underlying smart contracts, and how to create and
          propose new vaults."
          href="https://docs.element.fi/governance-council/council-protocol-smart-contracts/voting-vaults"
        />
      </div>
    </Page>
  );
}

interface VaultData {
  address: string;
  name: string;
  tvp: string | undefined;
  votingPower: string | undefined;
  sentenceSummary: string | undefined;
}

function useVaultsPageData(
  account: string | undefined,
): UseQueryResult<VaultData[]> {
  const { coreVoting, gscVoting } = useCouncil();
  const chainId = useChainId();
  const vaultConfigs = getAllVaultConfigs(chainId);

  return useQuery({
    queryKey: ["vaultsPage", account],
    queryFn: (): Promise<VaultData[]> => {
      let allVaults = coreVoting.vaults;
      if (gscVoting) {
        allVaults = [...allVaults, ...gscVoting.vaults];
      }

      return Promise.all(
        allVaults.map(async (vault) => {
          const vaultConfig = vaultConfigs.find(
            ({ address }) => vault.address === address,
          ) as VaultConfig;

          return {
            address: vault.address,
            name: vault.name,
            tvp: await vault.getTotalVotingPower?.(),
            votingPower: account && (await vault.getVotingPower(account)),
            sentenceSummary: vaultConfig.sentenceSummary,
          };
        }),
      );
    },
  });
}
