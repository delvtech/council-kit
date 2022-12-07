import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import Link from "next/link";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { makeVaultURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { useCouncil } from "src/ui/council/useCouncil";
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
          <LearnMoreCard />
          <LearnMoreCard />
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
                  {/* <GenericVaultCard />
                  <GenericVaultCard /> */}
                  {/* <LockingVaultCard /> */}

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
                {/* <div className="flex gap-x-4 mt-8 ">
                  <LearnMoreCard />
                  <LearnMoreCard />
                </div> */}
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

interface GenericVaultCardProps {
  address: string;
  name: string;
  tvp?: string;
  votingPower?: string;
}

function GenericVaultCard({
  address,
  name,
  tvp,
  votingPower,
}: GenericVaultCardProps) {
  return (
    <div className="daisy-card bg-base-200 shadow-lg md:w-[420px] border border-accent-focus">
      <figure>
        <img
          src="https://miro.medium.com/max/1400/1*910ehVPkh0d19QE7tPv29w.webp"
          alt="Shoes"
        />
      </figure>
      <div className="daisy-card-body">
        <h2 className="daisy-card-title">{name}</h2>

        <div className="daisy-card-actions justify-start">
          <div className="flex flex-row items-start mr-auto gap-x-6">
            {tvp && (
              <div>
                <h2>TVP</h2>
                <p className="font-bold">{formatBalance(tvp)}</p>
              </div>
            )}
            {votingPower && (
              <div>
                <h2>Your TVP</h2>
                <p className="font-bold">{formatBalance(votingPower)}</p>
              </div>
            )}
          </div>
          <button className=" daisy-btn daisy-btn-primary">Open Vault</button>
        </div>
      </div>
    </div>
  );
}

function LearnMoreCard() {
  return (
    <div className="p-4 border border-gray-300  rounded-xl w-fit hover:opacity-80 cursor-pointer select-text">
      <div className="mb-1">
        <h2 className="font-bold">
          Learn more about voting vaults <ExternalLinkSVG />
        </h2>
      </div>
      <h2>Check out our vault creation walk-through and migration guides.</h2>
    </div>
  );
}

interface VaultTableProps {
  rowData?: VaultRowData[];
}

function VaultTable({ rowData }: VaultTableProps) {
  return (
    <table className="daisy-table-zebra daisy-table w-full min-w-fit">
      <thead>
        <tr>
          <th>Address</th>
          <th>Name</th>
          <th>total voting power</th>
          <th>your voting power</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {rowData &&
          rowData.map((data) => <VaultTableRow key={data.address} {...data} />)}
      </tbody>
    </table>
  );
}

function VaultTableRow({ address, name, tvp, votingPower }: VaultRowData) {
  return (
    <tr key={address}>
      <th>
        <a
          href={makeEtherscanAddressURL(address)}
          target="_blank"
          rel="noreferrer"
        >
          {formatAddress(address)}
        </a>
      </th>
      <td>{name}</td>
      <td>{tvp ? formatBalance(tvp, 0) : "🤷"}</td>
      <td>{votingPower ? formatBalance(votingPower) : "🤷"}</td>
      <th>
        <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
          <Link href={makeVaultURL(address)}>▹</Link>
        </button>
      </th>
    </tr>
  );
}
