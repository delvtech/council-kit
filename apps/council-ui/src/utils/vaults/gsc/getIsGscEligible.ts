import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";
import { getCouncil } from "src/utils/council/getCouncil";

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

  const council = getCouncil(chainId);
  const gscVaultAddress = gscVoting.vaults[0].address;
  const gscVault = council.gscVault(gscVaultAddress);
  const approvedVaults = coreVoting.vaults.map(({ address }) =>
    council.votingVault(address),
  );

  const [requiredVotingPower, ...vaultVotingPowers] = await Promise.all([
    gscVault.getRequiredVotingPower(),
    ...approvedVaults.map((vault) =>
      vault
        .getVotingPower({ voter: account })
        // Wagmi doesn't decode the uninitialized error, so we simply
        // return 0 if the the call fails.
        .catch(() => 0n),
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
