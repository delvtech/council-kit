import {
  GSCVault,
  GSCVotingContract,
  Voter,
  VotingContract,
} from "@council/sdk";
import { Provider } from "@ethersproject/providers";
import { parseEther } from "ethers/lib/utils";
import { getBulkEnsRecords } from "src/ens/getBulkEnsRecords";

export type GSCStatus = "N/A" | "Idle" | "Member" | "Eligible" | "Ineligible";

interface GetGSCStatusOptions {
  coreVoting: VotingContract;
  gscVoting?: GSCVotingContract;
  address: string;
}

export async function getGSCStatus({
  coreVoting,
  gscVoting,
  address,
}: GetGSCStatusOptions): Promise<GSCStatus> {
  if (!gscVoting) {
    return "N/A";
  }

  if (await gscVoting.getIsIdle(address)) {
    return "Idle";
  }

  if (await gscVoting.getIsMember(address)) {
    return "Member";
  }

  const votingPower = await coreVoting.getVotingPower(address);
  const requiredVotingPower = await gscVoting.getRequiredVotingPower();

  if (parseEther(votingPower).gt(parseEther(requiredVotingPower))) {
    return "Eligible";
  }

  return "Ineligible";
}

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
