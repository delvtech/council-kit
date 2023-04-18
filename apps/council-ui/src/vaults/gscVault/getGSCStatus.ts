import { GSCVotingContract, VotingContract } from "@council/sdk";
import { GSCStatus } from "src/vaults/gscVault/types";
import { getIsGSCEligible } from "./getIsGSCEligible";

interface GetGSCStatusOptions {
  coreVoting: VotingContract;
  gscVoting?: GSCVotingContract;
  address: string | undefined;
}

/**
 * Get a specific GSC status for a voter. This method makes multiple calls for
 * multiple different scenarios. Prefer more specific methods over this one for
 * inferring specific information like whether the voter is a member or
 * eligible.
 */
export async function getGSCStatus({
  coreVoting,
  gscVoting,
  address,
}: GetGSCStatusOptions): Promise<GSCStatus> {
  if (!gscVoting || !address) {
    return "N/A";
  }

  if (await gscVoting.getIsIdle(address)) {
    return "Idle";
  }

  if (await gscVoting.getIsMember(address)) {
    return "Member";
  }

  const eligible = await getIsGSCEligible({
    address,
    coreVoting,
    gscVoting,
  });

  return eligible ? "Eligible" : "Ineligible";
}

export function getIsGSCMember(voterGSCStatus: GSCStatus): boolean {
  // "Idle" means you're a member that has recently joined and are currently in
  // your idleDuration phase.
  return voterGSCStatus === "Member" || voterGSCStatus === "Idle";
}
