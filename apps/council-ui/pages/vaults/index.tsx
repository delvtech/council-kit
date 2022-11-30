import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Link from "next/link";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { makeVaultURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useAccount } from "wagmi";

export default function VaultsPage(): ReactElement {
  const { address } = useAccount();
  const { data, isLoading, isError, error } = useVaultsPageData(address);

  return (
    <Page>
      {/* Page Header */}
      <div>
        <div className="text-5xl text-accent-content">Vaults</div>
        <div className="mt-6 text-lg">
          Voting Vaults provide the ability to assign voting power to specific
          types of tokens/positions. The result is beautiful — governance users
          can maximize capital efficiency while maintaining the ability to
          delegate or vote when the time comes.
        </div>
      </div>

      {isError ? (
        <div className="daisy-mockup-code">
          <code className="block whitespace-pre-wrap px-6 text-error">
            {error ? (error as any).toString() : "Unknown error"}
          </code>
        </div>
      ) : isLoading ? (
        <progress className="daisy-progress m-auto w-56 items-center"></progress>
      ) : (
        <VaultTable rowData={data} />
      )}
    </Page>
  );
}

interface VaultRowData {
  address: string;
  name: string;
  tvp: string | undefined;
  votingPower: string | undefined;
}

function useVaultsPageData(account?: string): UseQueryResult<VaultRowData[]> {
  const { coreVoting, gscVoting } = useCouncil();
  return useQuery({
    queryKey: ["vaultsPage", account, coreVoting.vaults, gscVoting],
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
          rowData.map((data) => <VaultTableRow {...data} key={data.address} />)}
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
