import Link from "next/link";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeVoterURL } from "src/routes";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { VoterRowData } from "src/ui/voters/types";

interface VoterListProps {
  voters: VoterRowData[];
  size: number;
  onSizeChange: (newSize: number) => void;
}

export function VoterList({
  voters,
  size,
  onSizeChange,
}: VoterListProps): ReactElement {
  return (
    <table className="daisy-table-zebra daisy-table w-full min-w-[250px] mb-10">
      <thead>
        <tr>
          <th>Voter</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="my-4">
        {voters.slice(0, size).map(({ address, ensName }) => {
          return (
            <tr key={address}>
              <td className="underline sm:px-8 md:text-lg">
                <Link
                  href={makeVoterURL(address)}
                  className="flex items-center"
                >
                  <WalletIcon address={address} className="mr-2" />
                  {ensName ? ensName : address}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>

      {voters.length > size && (
        <tfoot className="flex flex-col justify-center gap-4 py-8 text-center">
          <div className="font-medium">
            Only showings {size} voters, click to load more or refine using
            search.
          </div>
          <button
            className="daisy-btn daisy-btn-primary"
            onClick={() => onSizeChange(size + 50)}
          >
            Load more
          </button>
        </tfoot>
      )}
    </table>
  );
}

export function VoterListSkeleton(): ReactElement {
  return (
    <table className="daisy-table-zebra daisy-table w-full min-w-[250px]">
      <thead>
        <tr>
          <th className="w-[420px]">Voter</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>
      </tbody>
    </table>
  );
}
