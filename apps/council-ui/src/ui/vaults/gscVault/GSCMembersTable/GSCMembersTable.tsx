import { Signer } from "ethers";
import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { GridTableRowLink } from "src/ui/base/tables/GridTableRowLink";
import { GSCMembersTableHeader } from "src/ui/vaults/gscVault/GSCMembersTable/GSCMembersTableHeader";
import { useKickGSCMember } from "src/ui/vaults/gscVault/useKickGSCMember";
import { VoterAddress } from "src/ui/voters/VoterAddress/VoterAddress";
import { GSCMemberInfo } from "src/vaults/gscVault/getGSCMembers";
import { useSigner } from "wagmi";

interface GSCMembersTableProps {
  gscVaultAddress: string;
  members: GSCMemberInfo[];
  requiredVotingPower: string;
}

export function GSCMembersTable({
  members,
  requiredVotingPower,
  gscVaultAddress,
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
            gscVaultAddress={gscVaultAddress}
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
  gscVaultAddress: string;
  requiredVotingPower: string;
}

function GSCMembersTableRow({
  member: { member, ensName, qualifyingVotingPower },
  gscVaultAddress,
  requiredVotingPower,
}: GSCMembersTableRow) {
  const { data: signer } = useSigner();
  const isKickButtonDisabled =
    +qualifyingVotingPower > +requiredVotingPower && !!signer;
  const { mutate: kickGSCMember } = useKickGSCMember(gscVaultAddress);
  return (
    <GridTableRowLink href={makeVoterURL(member.address)}>
      <VoterAddress address={member.address} ensName={ensName} />
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
            kickGSCMember({
              memberAddress: member.address,
              // safe to cast because button is disabled when signer is undefined
              signer: signer as Signer,
            });
          }}
        >
          Kick Member
        </button>
      </span>
    </GridTableRowLink>
  );
}
