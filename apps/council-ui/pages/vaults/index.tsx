import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import {
  GenericVaultCard,
  GenericVaultCardSkeleton,
} from "src/ui/vaults/GenericVaultCard";
import { GSCVaultPreviewCard } from "src/ui/vaults/gscVault/GSCVaultPreviewCard/GSCVaultPreviewCard";
import { useAccount } from "wagmi";

export default function VaultsPage(): ReactElement {
  const { address } = useAccount();
  const { data, status } = useVaultsPageData(address);

  return (
    <Page>
      <div className="px-4">
        <h1 className="text-5xl font-bold">Voting Vaults</h1>
        <p className="mt-6 text-lg">
          Voting Vaults provide the ability to assign voting power to specific
          types of tokens/positions. The result is beautiful — governance users
          can maximize capital efficiency while maintaining the ability to
          delegate or vote when the time comes.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 lg:justify-start">
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
          body="Read our intro post to learn more about voting vaults and the vision behind them."
          href="https://blog.element.fi/voting-vaults-a-new-defi-and-governance-primitive-2/"
        />
        <ExternalInfoCard
          header="Read the docs"
          body="Check out our documentation on voting votes and other parts of the council protocol."
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
}

function useVaultsPageData(
  account: string | undefined,
): UseQueryResult<VaultData[]> {
  const { coreVoting, gscVoting } = useCouncil();

  return useQuery({
    queryKey: ["vaultsPage", account],
    queryFn: (): Promise<VaultData[]> => {
      let allVaults = coreVoting.vaults;
      if (gscVoting) {
        allVaults = [...allVaults, ...gscVoting.vaults];
      }

      return Promise.all(
        allVaults.map(async (vault) => {
          return {
            address: vault.address,
            name: vault.name,
            tvp: await vault.getTotalVotingPower?.(),
            votingPower: account && (await vault.getVotingPower(account)),
          };
        }),
      );
    },
  });
}
