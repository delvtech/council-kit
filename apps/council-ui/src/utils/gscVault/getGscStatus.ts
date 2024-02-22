import {
  ReadGscVault,
  ReadVoter,
  ReadVotingVault,
} from "@delvtech/council-viem";
import { getIsGscEligible } from "src/utils/gscVault/getIsGscEligible";
import { GscStatus } from "src/utils/gscVault/types";

interface GetGscStatusOptions {
  qualifyingVaults: ReadVotingVault[];
  gscVault?: ReadGscVault;
  account?: `0x${string}` | ReadVoter;
}

/**
 * Get a specific GSC status for a voter. This method makes multiple calls for
 * multiple different scenarios. Prefer more specific methods over this one for
 * inferring specific information like whether the voter is a member or
 * eligible.
 */
export async function getGscStatus({
  qualifyingVaults,
  gscVault,
  account,
}: GetGscStatusOptions): Promise<GscStatus> {
  if (!gscVault || !account) {
    return "N/A";
  }

  if (await gscVault.getIsIdle({ account })) {
    return "Idle";
  }

  if (await gscVault.getIsMember({ account })) {
    return "Member";
  }

  const eligible = await getIsGscEligible({
    account: account,
    gscVault,
    qualifyingVaults,
  });

  return eligible ? "Eligible" : "Ineligible";
}

export function getIsGscMember(voterGSCStatus: GscStatus): boolean {
  // "Idle" means you're a member that has recently joined and are currently in
  // your idleDuration phase.
  return voterGSCStatus === "Member" || voterGSCStatus === "Idle";
}
