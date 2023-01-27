import { Voter } from "@council/sdk";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { useBulkEnsRecords } from "src/ui/base/ens/useBulkEnsRecords";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { WalletIcon } from "src/ui/base/WalletIcon";

interface VotersListCompactProps {
  voters: Voter[];
}

export function VotersListCompact({
  voters,
}: VotersListCompactProps): ReactElement {
  const { data: ensRecords } = useBulkEnsRecords(
    voters.map((voter) => voter.address),
  );

  return (
    <table className="w-full daisy-table daisy-table-compact">
      <thead>
        <tr>
          <th>Voter</th>
        </tr>
      </thead>
      <tbody>
        {voters.map((voter) => (
          <tr key={voter.address}>
            <th>
              <Link
                href={makeVoterURL(voter.address)}
                className="flex items-center gap-x-2 hover:underline"
              >
                <WalletIcon address={voter.address} />
                {ensRecords && ensRecords[voter.address] ? (
                  <p>{ensRecords[voter.address]}</p>
                ) : (
                  <p>{formatAddress(voter.address)}</p>
                )}
              </Link>
            </th>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
