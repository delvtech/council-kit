import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import {
  GenericVaultCard,
  GenericVaultCardSkeleton,
} from "src/ui/vaults/GenericVaultCard";
import { GscVaultPreviewCard } from "src/ui/vaults/gscVault/GscVaultPreviewCard";
import { getVotingPower } from "src/utils/vaults/getVotingPower";
import { useAccount } from "wagmi";

export default function VaultsPage(): ReactElement {
  const { address } = useAccount();
  const { data, status, error } = useVaultsPageData(address);
  console.log({ data, status, error });

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
                  <GscVaultPreviewCard
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
  tvp?: bigint;
  votingPower?: bigint;
  sentenceSummary?: string;
}

function useVaultsPageData(
  account: `0x${string}` | undefined,
): UseQueryResult<VaultData[]> {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const config = useCouncilConfig();
  const enabled = !!council;

  return useQuery({
    queryKey: ["vaultsPage", account],
    enabled,
    queryFn: enabled
      ? async (): Promise<VaultData[]> => {
          const vaultDataRequests: Promise<VaultData>[] =
            config.coreVoting.vaults.map(
              async ({ address, name, type, sentenceSummary }) => {
                let tvp: bigint | Promise<bigint> = 0n;
                switch (type) {
                  case "LockingVault":
                  case "FrozenLockingVault":
                    tvp = council.lockingVault(address).getTotalVotingPower();
                    break;
                  case "VestingVault":
                    tvp = council.vestingVault(address).getTotalVotingPower();
                    break;
                }

                let accountVotingPower = account
                  ? getVotingPower({
                      chainId,
                      vault: address,
                      voter: account,
                    })
                  : 0n;

                return Promise.all([tvp, accountVotingPower]).then(
                  ([tvp, votingPower]) => ({
                    address,
                    name,
                    tvp,
                    votingPower,
                    sentenceSummary,
                  }),
                );
              },
            );

          if (config.gscVoting) {
            const vaultConfig = config.gscVoting.vaults[0];
            vaultDataRequests.push(
              Promise.resolve({
                address: vaultConfig.address,
                name: vaultConfig.name,
                sentenceSummary: vaultConfig.sentenceSummary,
              }),
            );
          }

          return Promise.all(vaultDataRequests);
        }
      : undefined,
  });
}
