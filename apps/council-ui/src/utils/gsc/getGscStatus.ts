import { createCouncil } from "@delvtech/council-js";
import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";
import { getDrift } from "src/lib/drift";
import { getIsGscEligible } from "src/utils/gsc/getIsGscEligible";
import { GscStatus } from "src/utils/gsc/types";

interface GetGscStatusOptions {
  account: Address | undefined;
  chainId: SupportedChainId;
}

/**
 * Get a specific GSC status for a voter. This method makes multiple calls for
 * multiple different scenarios. Prefer more specific methods over this one for
 * inferring specific information like whether the voter is a member or
 * eligible.
 */
export async function getGscStatus({
  account,
  chainId,
}: GetGscStatusOptions): Promise<GscStatus> {
  const { gscVoting } = getCouncilConfig(chainId);

  if (!gscVoting || !account) {
    return "N/A";
  }

  const council = createCouncil({
    drift: getDrift({ chainId }),
  });

  const gscVaultAddress = gscVoting.vaults[0].address;
  const gscVault = council.gscVault(gscVaultAddress);

  if (await gscVault.getIsIdle(account)) {
    return "Idle";
  }

  if (await gscVault.getIsMember(account)) {
    return "Member";
  }

  const eligible = await getIsGscEligible({
    account,
    chainId,
  });

  return eligible ? "Eligible" : "Ineligible";
}

export function isGscMember(voterGscStatus: GscStatus): boolean {
  // "Idle" means you're a member that has recently joined and are currently in
  // your idleDuration phase.
  return voterGscStatus === "Member" || voterGscStatus === "Idle";
}
