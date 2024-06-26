import { ReadLockingVault, ReadVestingVault } from "@delvtech/council-viem";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useReadGscVoting } from "src/ui/council/hooks/useReadGscVoting";
import {
  GenericVaultCard,
  GenericVaultCardSkeleton,
} from "src/ui/vaults/GenericVaultCard";
import { GSCVaultPreviewCard } from "src/ui/vaults/gscVault/GscVaultPreviewCard";
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

      <div className="grid grid-flow-row grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      <div className="mb-2 flex flex-wrap gap-4 sm:flex-nowrap">
        <ExternalInfoCard
          header="Learn more about voting vaults"
          body="Read our intro post to learn more about voting vaults and the vision behind them."
          href="https://blog.delv.tech/voting-vaults-a-new-defi-and-governance-primitive-2/"
        />
        <ExternalInfoCard
          header="Read the docs"
          body="Check out our documentation on voting vaults and other parts of the council protocol."
          href="https://docs-delv.gitbook.io/element-developer-docs/governance-council/council-protocol-smart-contracts/voting-vaults"
        />
      </div>
    </Page>
  );
}

interface VaultData {
  address: `0x${string}`;
  name: string;
  tvp: bigint | undefined;
  votingPower: bigint | undefined;
  sentenceSummary: string | undefined;
}

function useVaultsPageData(
  account: `0x${string}` | undefined,
): UseQueryResult<VaultData[]> {
  const coreVoting = useReadCoreVoting();
  const gscVoting = useReadGscVoting();
  const config = useCouncilConfig();

  return useQuery({
    queryKey: ["vaultsPage", account],
    queryFn: async (): Promise<VaultData[]> => {
      const data: VaultData[] = [];

      // core voting vaults
      for (const vault of coreVoting.vaults) {
        const vaultConfig = config.coreVoting.vaults.find(
          ({ address }) => address === vault.address,
        );

        let tvp: bigint | undefined = undefined;
        if (
          vault instanceof ReadLockingVault ||
          vault instanceof ReadVestingVault
        ) {
          tvp = await vault.getTotalVotingPower();
        }

        data.push({
          address: vault.address,
          name: vaultConfig?.name || vault.name,
          tvp,
          votingPower: account && (await vault.getVotingPower({ account })),
          sentenceSummary: vaultConfig?.sentenceSummary,
        });
      }

      // gsc vault
      if (gscVoting) {
        for (const vault of gscVoting.vaults) {
          data.push({
            address: vault.address,
            name: config.gscVoting!.vault.name,
            tvp: undefined,
            votingPower: account && (await vault.getVotingPower({ account })),
            sentenceSummary: config.gscVoting!.vault.sentenceSummary,
          });
        }
      }

      return data;
    },
  });
}
