import { VotingVault } from "..";

export async function getVaultsWithPower(
  account: string,
  vaults: VotingVault[],
): Promise<VotingVault[]> {
  const vaultsWithPower: VotingVault[] = [];

  for (const vault of vaults) {
    try {
      const votingPower = await vault.getVotingPower(account);

      if (+votingPower > 0) {
        vaultsWithPower.push(vault);
      }
    } catch {}
  }

  return vaultsWithPower;
}
