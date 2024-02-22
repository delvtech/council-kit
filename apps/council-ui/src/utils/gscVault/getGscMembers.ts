import {
  ReadGscVault,
  ReadVoter,
  ReadVotingVault,
} from "@delvtech/council-viem";
import { getBulkEnsRecords } from "src/utils/getBulkEnsRecords";
import { PublicClient } from "viem";

export interface GscMemberInfo {
  member: ReadVoter;
  qualifyingVotingPower: bigint;
  ensName: string | null;
}

export async function getGscMembers({
  client,
  approvedVaults,
  gscVault,
}: {
  gscVault: ReadGscVault;
  approvedVaults: (ReadVotingVault | `0x${string}`)[];
  client: PublicClient;
}): Promise<GscMemberInfo[]> {
  const members = await gscVault.getVoters();

  // TODO: Why did we do this again? Won't this hide kickable members?
  // GSC Members must have enough qualifying voting power in the
  // coreVoting approved vaults to be in good standing.
  const membersQualifyingVotingPower = await Promise.all(
    members.map((member) =>
      member.getVotingPower({
        vaults: approvedVaults,
      }),
    ),
  );

  const memberENSNames = await getBulkEnsRecords(
    members.map((member) => member.address),
    client,
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
