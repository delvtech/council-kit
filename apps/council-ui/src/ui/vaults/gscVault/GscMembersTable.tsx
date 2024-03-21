import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import { GridTableRowLink } from "src/ui/base/tables/GridTableRowLink";
import { GscMembersTableHeader } from "src/ui/vaults/gscVault/GscMembersTableHeader";
import { useKickGscMember } from "src/ui/vaults/gscVault/hooks/useKickGscMember";
import { VoterAddress } from "src/ui/voters/VoterAddress";
import { GscMemberInfo } from "src/utils/gscVault/getGscMembers";

interface GscMembersTableProps {
  members: GscMemberInfo[];
  requiredVotingPower: bigint;
}

export function GscMembersTable({
  members,
  requiredVotingPower,
}: GscMembersTableProps): ReactElement {
  return (
    <div className="w-full overflow-auto">
      <GscMembersTableHeader />

      {members.length ? (
        members.map((memberInfo) => (
          <GSCMembersTableRow
            key={memberInfo.member.address}
            requiredVotingPower={requiredVotingPower}
            member={memberInfo}
          />
        ))
      ) : (
        <div className="p-8 text-center">No GSC Members</div>
      )}
    </div>
  );
}

interface GSCMembersTableRow {
  member: GscMemberInfo;
  requiredVotingPower: bigint;
}

function GSCMembersTableRow({
  member: { member, ensName, qualifyingVotingPower },
  requiredVotingPower,
}: GSCMembersTableRow) {
  const { kickGscMember } = useKickGscMember();

  const isKickButtonDisabled =
    qualifyingVotingPower >= requiredVotingPower && !!kickGscMember;

  return (
    <GridTableRowLink href={makeVoterURL(member.address)}>
      <VoterAddress address={member.address} ensName={ensName} />
      <span className="flex items-center">
        {formatVotingPower(qualifyingVotingPower)}
      </span>

      <span className="flex items-center">
        <button
          className="daisy-btn"
          disabled={isKickButtonDisabled}
          onClick={(e) => {
            // prevent clicking the button from navigating the user to the voter
            // page, since this is a button inside of a link..
            e.preventDefault();
            kickGscMember?.(member.address);
          }}
        >
          Kick Member
        </button>
      </span>
    </GridTableRowLink>
  );
}
