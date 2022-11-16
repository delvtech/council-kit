import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Page } from "components/base/Page";
import Link from "next/link";
import { ReactElement } from "react";
import { makeEtherscanHref } from "src/paths/makeEtherscanHref";
import { makeVaultHref } from "src/routing/makeRoute";
import { useCouncil } from "src/ui/council/useCouncil";
import { formatAddress } from "src/ui/utils/formatAddress";
import { formatBalance } from "src/ui/utils/formatBalance";
import { useAccount } from "wagmi";

export default function Vaults(): ReactElement {
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

      {/* Vault Table */}
      <table className="w-full daisy-table-zebra daisy-table min-w-fit">
        {/* Table Headers */}
        <thead>
          <tr>
            <th>Address</th>
            <th>Name</th>
            <th>total voting power</th>
            <th>your voting power</th>
            <th></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={7}>Loading...</td>
            </tr>
          )}
          {isError && !isLoading && (
            <tr>
              <td colSpan={7}>
                <div className="daisy-mockup-code">
                  <code className="block px-6 whitespace-pre-wrap text-error">
                    {(error as any).toString()}
                  </code>
                </div>
              </td>
            </tr>
          )}
          {data &&
            !isLoading &&
            !isError &&
            data.map(({ address, name, tvp, votingPower }) => (
              <tr key={address}>
                <th>
                  <a
                    href={makeEtherscanHref(address)}
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
                    <Link href={makeVaultHref(address)}>▹</Link>
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
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
  account?: string,
): UseQueryResult<VaultRowData[], unknown> {
  const { coreVoting, gscVoting } = useCouncil();
  return useQuery(["vaultsPage", account], () => {
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
  });
}
interface VaultTableProps {
  // TODO @cashd: replace with sdk types
  vaults: Vault[];
}

function VaultTable({ vaults }: VaultTableProps) {
  return (
    <table className="w-full daisy-table-zebra daisy-table min-w-fit">
      {/* Table Headers */}
      <thead>
        <tr>
          <th>Address</th>
          <th>Name</th>
          <th>total voting power</th>
          <th>your voting power</th>
          <th></th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        {vaults.map((vault) => (
          <VaultTableRow vault={vault} key={vault.address} />
        ))}
      </tbody>
    </table>
  );
}

interface VaultTableRowProps {
  // TODO @cashd: replace with sdk types
  vault: Vault;
}

function VaultTableRow({ vault }: VaultTableRowProps) {
  return (
    <tr>
      {/* TODO @cashd: format units */}
      <th className="underline">{vault.address}</th>
      <td>{vault.name}</td>
      <td>{vault.totalVotingPower}</td>
      <td>{vault.yourVotingPower}</td>
      <th>
        <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
          <Link href={makeVaultHref(vault.address)}>▹</Link>
        </button>
      </th>
    </tr>
  );
}

// TODO @cashd: replace with sdk types
interface Vault {
  address: string;
  name: string;
  totalVotingPower: number;
  yourVotingPower: number;
}

// TODO @cashd: remove stubbed data
const mockVaults: Vault[] = [
  {
    address: "0x200...000",
    name: "Locking Vault",
    totalVotingPower: 1_000_000,
    yourVotingPower: 50_000,
  },
  {
    address: "0x300...000",
    name: "Vesting Vault",
    totalVotingPower: 1_000_000,
    yourVotingPower: 50_000,
  },
  {
    address: "0x400...000",
    name: "GSC Vault",
    totalVotingPower: 1_000_000,
    yourVotingPower: 50_000,
  },
  {
    address: "0x500...000",
    name: "NFT Vault",
    totalVotingPower: 1_000_000,
    yourVotingPower: 50_000,
  },
  {
    address: "0x600...000",
    name: "GitHub Vault",
    totalVotingPower: 1_000_000,
    yourVotingPower: 50_000,
  },
  {
    address: "0x700...000",
    name: "DAO Contributor Vault",
    totalVotingPower: 1_000_000,
    yourVotingPower: 50_000,
  },
];
