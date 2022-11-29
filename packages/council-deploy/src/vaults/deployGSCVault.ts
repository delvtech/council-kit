import { GSCVault, GSCVault__factory } from "@council/typechain";
import { Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";

interface DeployGSCVaultOptions {
  signer: Signer;
  coreVotingAddress: string;
  votingPowerBound: string;
  ownerAddress: string;
  /**
   * The duration (in seconds) during which new gsc members remain unable to
   * vote
   */
  idleDuration: number;
}

export async function deployGSCVault({
  signer,
  coreVotingAddress,
  votingPowerBound,
  ownerAddress,
  idleDuration,
}: DeployGSCVaultOptions): Promise<GSCVault> {
  const gscVaultDeployer = new GSCVault__factory(signer);
  const gscVault = await gscVaultDeployer.deploy(
    coreVotingAddress,
    parseEther(votingPowerBound),
    // temporarily set the owner as the signer so we can call setIdleDuration
    await signer.getAddress(),
  );

  // This must be done after the contract is deployed
  await gscVault.setIdleDuration(idleDuration);

  // Finalize the deployment by setting the owner
  await gscVault.setOwner(ownerAddress);

  console.log("Deployed GSCVault");

  return gscVault;
}
