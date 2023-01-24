import Link from "next/link";
import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { GSCMembersTableHeader } from "src/ui/vaults/gscVault/GSCMembersTable/GSCMembersTableHeader";
import { GSCMemberInfo } from "src/vaults/gscVault";

interface GSCMembersTableProps {
  members: GSCMemberInfo[];
  requiredVotingPower: string;
}

export function GSCMembersTable({
  members,
  requiredVotingPower,
}: GSCMembersTableProps): ReactElement {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full daisy-table-zebra daisy-table">
        <GSCMembersTableHeader />

        <tbody className="overflow-auto">
          {members.map((memberInfo) => (
            <GSCMembersTableRow
              key={memberInfo.member.address}
              requiredVotingPower={requiredVotingPower}
              member={memberInfo}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface GSCMembersTableRow {
  member: GSCMemberInfo;
  requiredVotingPower: string;
}

function GSCMembersTableRow({
  member: { member, ensName, qualifyingVotingPower },
  requiredVotingPower,
}: GSCMembersTableRow) {
  const isKickButtonDisabled = +qualifyingVotingPower > +requiredVotingPower;
  return (
    <tr>
      <td>
        <Link
          className="daisy-link daisy-link-hover flex items-center"
          href={makeVoterURL(member.address)}
        >
          <WalletIcon address={member.address} className="mr-2" />
          {ensName ?? formatAddress(member.address)}
        </Link>
      </td>
      <td>{formatBalance(qualifyingVotingPower)}</td>
      <td>
        <button className="daisy-btn" disabled={isKickButtonDisabled}>
          Kick Member
        </button>
      </td>
    </tr>
  );
}
