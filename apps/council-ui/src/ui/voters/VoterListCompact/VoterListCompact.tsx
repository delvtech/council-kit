import { Voter } from "@council/sdk";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { useBulkEnsRecords } from "src/ui/ens/useBulkEnsRecords";
import { VoterAddress } from "src/ui/voters/VoterAddress/VoterAddress";

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
        {voters.map((voter) => {
          const ensName = ensRecords?.[voter.address];
          return (
            <tr key={voter.address}>
              <th>
                <Link
                  href={makeVoterURL(voter.address)}
                  className="flex items-center gap-x-2 hover:underline"
                >
                  <VoterAddress address={voter.address} ensName={ensName} />
                </Link>
              </th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
