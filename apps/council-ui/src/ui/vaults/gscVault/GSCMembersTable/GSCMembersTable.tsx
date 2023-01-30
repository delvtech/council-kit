import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { GridTableRowLink } from "src/ui/base/tables/GridTableRowLink";
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
      <GSCMembersTableHeader />

      {members.length ? (
        members.map((memberInfo) => (
          <GSCMembersTableRow
            key={memberInfo.member.address}
            requiredVotingPower={requiredVotingPower}
            member={memberInfo}
          />
        ))
      ) : (
        <div className="text-center p-8">No GSC Members</div>
      )}
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
    <GridTableRowLink href={makeVoterURL(member.address)}>
      <span className="flex items-center">
        <WalletIcon address={member.address} className="mr-2" />
        {ensName ?? formatAddress(member.address)}
      </span>
      <span className="flex items-center">
        {formatBalance(qualifyingVotingPower)}
      </span>

      <span className="flex items-center">
        <button
          className="daisy-btn"
          disabled={isKickButtonDisabled}
          onClick={(e) => {
            // prevent clicking the button from navigating the user to the voter
            // page, since this is a button inside of a link..
            e.preventDefault();
          }}
        >
          Kick Member
        </button>
      </span>
    </GridTableRowLink>
  );
}
