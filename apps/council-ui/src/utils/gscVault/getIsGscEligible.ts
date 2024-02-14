import {
  ReadGscVault,
  ReadVoter,
  ReadVotingVault,
} from "@delvtech/council-viem";

interface GetIsGscEligibleOptions {
  account: `0x${string}` | ReadVoter;
  qualifyingVaults: ReadVotingVault[];
  gscVault?: ReadGscVault;
}

export async function getIsGscEligible({
  account,
  qualifyingVaults,
  gscVault,
}: GetIsGscEligibleOptions): Promise<boolean> {
  if (!gscVault) {
    return false;
  }

  let qualifyingVotingPower = 0n;
  for (const vault of qualifyingVaults) {
    qualifyingVotingPower += await vault.getVotingPower({ account });
  }

  const requiredVotingPower = await gscVault.getRequiredVotingPower();
  if (qualifyingVotingPower > requiredVotingPower) {
    return true;
  }

  return false;
}
