import { createCouncil } from "@delvtech/council-js";
import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";
import { getDrift } from "src/lib/drift";
import { getBulkEnsRecords } from "src/utils/getBulkEnsRecords";

export interface GscMemberInfo {
  member: Address;
  qualifyingVotingPower: bigint;
  ensName: string | undefined;
}

export async function getGscMembers({
  chainId,
}: {
  chainId: SupportedChainId;
}): Promise<GscMemberInfo[]> {
  const { gscVoting } = getCouncilConfig(chainId);

  if (!gscVoting) {
    return [];
  }

  const council = createCouncil({
    drift: getDrift({ chainId }),
  });

  const gscVaultAddress = gscVoting.vaults[0].address;
  const gscVault = council.gscVault(gscVaultAddress);

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
