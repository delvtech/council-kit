import { VestingVault__factory } from "@council/typechain";
import { Wallet } from "ethers";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

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
}: DeployVestingVaultOptions): Promise<
  ContractWithDeploymentArgs<VestingVault__factory>
> {
  const vestingVaultFactory = new VestingVault__factory(signer);
  const deploymentArgs: DeployArguments<VestingVault__factory> = [
    votingTokenAddress,
    staleBlockLag,
  ];
  const vestingVault = await vestingVaultFactory.deploy(...deploymentArgs);
  await vestingVault.deployTransaction.wait(1);
  console.log("Deployed VestingVault");

  await vestingVault.initialize(signer.address, signer.address);

  // Only the Timelock can update things like the unvestedMultiplier.
  await vestingVault.setTimelock(timelockAddress);
  console.log("Set Timelock permissions on VestingVault");

  return {
    address: vestingVault.address,
    name: "VestingVault",
    type: "VestingVault",
    contract: vestingVault,
    deploymentArgs,
  };
}
