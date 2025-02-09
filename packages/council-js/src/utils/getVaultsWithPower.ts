import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";


export async function getVaultsWithPower(
  account: `0x${string}`,
  vaults: ReadVotingVault[],
): Promise<ReadVotingVault[]> {
  const vaultsWithPower: ReadVotingVault[] = [];

  for (const vault of vaults) {
    // Some vaults may throw an error when voting power is zero or cannot find
    // found. The catch block ensures this does not interrupt any voting flows.
    const votingPower = await vault.getVotingPower({ account: account }).catch(() => 0n);

    if (votingPower > 0n) {
      vaultsWithPower.push(vault);
    }
  }

  return vaultsWithPower;
}
