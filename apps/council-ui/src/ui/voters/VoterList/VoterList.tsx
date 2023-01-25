import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";
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
    <div className="min-w-[250px]">
      <GridTableHeader className="grid-cols-[5fr_2fr_56px]">
        <span>Voter</span>
        <span>Voting Power</span>
        <span></span>
      </GridTableHeader>

      {voters.slice(0, size).map(({ address, ensName, votingPower }) => {
        return (
          <Link
            key={address}
            href={makeVoterURL(address)}
            className="group grid grid-cols-[5fr_2fr_56px] odd:bg-base-200 hover:bg-base-300 transition-all last:rounded-b-lg [&>*]:p-4 [&>*]:flex [&>*]:items-center"
          >
            <span>
              <WalletIcon address={address} className="mr-2" />
              {ensName ? ensName : address}
            </span>
            <span>{formatBalance(votingPower, 0)}</span>
            <span>
              <ChevronRightIcon className="block w-6 h-6 stroke-current opacity-40 group-hover:opacity-100 transition-all" />
            </span>
          </Link>
        );
      })}

      {voters.length > size && (
        <div className="flex flex-col justify-center gap-4 py-8 text-center">
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
        </div>
      )}
    </div>
  );
}
