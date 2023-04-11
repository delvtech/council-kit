import { GSCVault__factory } from "@council/typechain";
import { Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

interface DeployGSCVaultOptions {
  signer: Signer;
  coreVotingAddress: string;
  /**
   * Voting power requirement in coreVoting to get onto the GSC
   */
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
}: DeployGSCVaultOptions): Promise<
  ContractWithDeploymentArgs<GSCVault__factory>
> {
  console.log("Deploying GSCVault...");
  const gscVaultFactory = new GSCVault__factory(signer);
  const deploymentArgs: DeployArguments<GSCVault__factory> = [
    coreVotingAddress,
    parseEther(votingPowerBound).toHexString(),
    // deploy this with the signer as the owner so we can call setIdleDuration,
    // after that we'll set the owner to the ownerAddress
    await signer.getAddress(),
  ];
  const gscVault = await gscVaultFactory.deploy(...deploymentArgs);
  await gscVault.deployTransaction.wait(1);

  // This must be done after the contract is deployed
  await gscVault.setIdleDuration(idleDuration);

  // Finalize the deployment by setting the owner
  await gscVault.setOwner(ownerAddress);

  console.log(`Deployed GSCVault @ ${gscVault.address}`);

  return {
    address: gscVault.address,
    name: "GSCVault",
    contract: gscVault,
    deploymentArgs,
  };
}
