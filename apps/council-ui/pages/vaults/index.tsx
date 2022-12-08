import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { ReactElement } from "react";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { useCouncil } from "src/ui/council/useCouncil";
import { GenericVaultCard } from "src/ui/vaults/base/GenericVaultCard";
import { useAccount } from "wagmi";

export default function VaultsPage(): ReactElement {
  const { address } = useAccount();
  const { data, status, error } = useVaultsPageData(address);

  return (
    <Page>
      <div>
        <div className="text-5xl text-accent-content">Voting Vaults</div>
        <div className="mt-6 text-lg">
          Voting Vaults provide the ability to assign voting power to specific
          types of tokens/positions. The result is beautiful — governance users
          can maximize capital efficiency while maintaining the ability to
          delegate or vote when the time comes.
        </div>

        <div className="flex mt-8 gap-4 flex-wrap sm:flex-nowrap">
          <ExternalInfoCard
            header="Learn more about voting vaults"
            body="Check out our documentation on voting votes and other parts of the council protocol."
            href="#"
          />
          <ExternalInfoCard
            header="Explore other types of vaults"
            body="Dive into the examples of voting vaults in our open source repository."
            href="#"
          />
        </div>
      </div>

      {(() => {
        switch (status) {
          case "loading":
            return (
              <div className="flex flex-col items-center gap-8 ">
                <p>Loading vaults This might take a while...</p>
                <Progress />
              </div>
            );

          case "error":
            return (
              <div className="daisy-mockup-code">
                <code className="block whitespace-pre-wrap px-6 text-error">
                  {error ? (error as string).toString() : "Unknown error"}
                </code>
              </div>
            );

          case "success":
            return (
              <div className="mb-8">
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                  {data &&
                    data.map((vault) => {
                      return (
                        <GenericVaultCard
                          key={vault.address}
                          address={vault.address}
                          name={vault.name}
                          tvp={vault.tvp}
                          votingPower={vault.votingPower}
                        />
                      );
                    })}
                </div>
              </div>
            );
          default:
            assertNever(status);
        }
      })()}
    </Page>
  );
}

interface VaultRowData {
  address: string;
  name: string;
  tvp: string | undefined;
  votingPower: string | undefined;
}

function useVaultsPageData(
  account: string | undefined,
): UseQueryResult<VaultRowData[]> {
  const { coreVoting, gscVoting } = useCouncil();
  return useQuery({
    queryKey: ["vaultsPage", account],
    queryFn: () => {
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
