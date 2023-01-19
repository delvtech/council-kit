import { VotingVault } from "..";

export async function getVaultsWithPower(
  account: string,
  vaults: VotingVault[],
): Promise<VotingVault[]> {
  const vaultsWithPower: VotingVault[] = [];

  for (const vault of vaults) {
    // Some vaults may throw an error when voting power is zero or cannot find found.
    // The empty catch block ensures this does not interrupt any voting flows.
    const votingPower = await vault.getVotingPower(account).catch(() => {});

    if (+votingPower > 0) {
      vaultsWithPower.push(vault);
    }
  }

  return vaultsWithPower;
}
