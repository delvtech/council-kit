import { createCouncil } from "@delvtech/council-js";
import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";
import { getDrift } from "src/lib/drift";

interface GetIsGscEligibleOptions {
  account: Address | undefined;
  chainId: SupportedChainId;
}

export async function getIsGscEligible({
  account,
  chainId,
}: GetIsGscEligibleOptions): Promise<boolean> {
  const { coreVoting, gscVoting } = getCouncilConfig(chainId);

  if (!gscVoting || !account) {
    return false;
  }

  const council = createCouncil({
    drift: getDrift({ chainId }),
  });

  const gscVaultAddress = gscVoting.vaults[0].address;
  const gscVault = council.gscVault(gscVaultAddress);
  const qualifyingVaults = coreVoting.vaults.map(({ address }) =>
    council.votingVault(address),
  );

  const [requiredVotingPower, ...vaultVotingPowers] = await Promise.all([
    gscVault.getRequiredVotingPower(),
    ...qualifyingVaults.map((vault) =>
      vault.getVotingPower({ voter: account }),
    ),
  ]);

  const qualifyingVotingPower = vaultVotingPowers.reduce(
    (total, votingPower) => total + votingPower,
    0n,
  );

  if (qualifyingVotingPower > requiredVotingPower) {
    return true;
  }

  return false;
}
