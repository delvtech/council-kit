import { GSCVault, Voter } from "@council/sdk";
import { Provider } from "@ethersproject/providers";
import { getBulkEnsRecords } from "src/ens/getBulkEnsRecords";

export interface GSCMemberInfo {
  member: Voter;
  qualifyingVotingPower: string;
  ensName: string | null;
}

export async function getGSCMembers(
  gscVault: GSCVault,
  coreVotingApprovedVaults: string[],
  provider: Provider,
): Promise<GSCMemberInfo[]> {
  const members = await gscVault.getVoters();

  // GSC Members must have enough qualifying voting power in the
  // coreVoting approved vaults to be in good standing.
  const membersQualifyingVotingPower = await Promise.all(
    members.map((member) => member.getVotingPower(coreVotingApprovedVaults)),
  );

  const memberENSNames = await getBulkEnsRecords(
    members.map((member) => member.address),
    provider,
  );

  const membersWithQualifyingVotePowerAndEnsRecord = members.map(
    (member, i) => {
      const qualifyingVotingPower = membersQualifyingVotingPower[i];
      const ensName = memberENSNames[member.address];
      return {
        member,
        qualifyingVotingPower,
        ensName,
      };
    },
  );

  return membersWithQualifyingVotePowerAndEnsRecord;
}
