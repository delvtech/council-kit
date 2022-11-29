import { VestingVault, VestingVault__factory } from "@council/typechain";
import { Wallet } from "ethers";

interface DeployVestingVaultOptions {
  signer: Wallet;
  votingTokenAddress: string;

  timelockAddress: string;
  /**
   * A user's vote power can be used on proposal for this long after the
   * proposal is created.
   */
  staleBlockLag: number;
}

export async function deployVestingVault({
  signer,
  votingTokenAddress,
  staleBlockLag,
  timelockAddress,
}: DeployVestingVaultOptions): Promise<VestingVault> {
  const vestingVaultDeployer = new VestingVault__factory(signer);
  const vestingVault = await vestingVaultDeployer.deploy(
    votingTokenAddress,
    staleBlockLag,
  );
  await vestingVault.initialize(signer.address, signer.address);
  console.log("Deployed VestingVault");

  // Only the Timelock can update things like the unvestedMultiplier.
  await vestingVault.setTimelock(timelockAddress);
  console.log("Set Timelock permissions on VestingVault");

  return vestingVault;
}
