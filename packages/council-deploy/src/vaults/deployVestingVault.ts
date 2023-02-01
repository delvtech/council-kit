import {
  SimpleProxy__factory,
  VestingVault__factory,
} from "@council/typechain";
import { Wallet } from "ethers";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

interface DeployVestingVaultOptions {
  signer: Wallet;
  votingTokenAddress: string;
  proxyOwnerAddress: string;
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
  proxyOwnerAddress,
}: DeployVestingVaultOptions): Promise<{
  vestingVault: ContractWithDeploymentArgs<VestingVault__factory>;
  vestingVaultProxy: ContractWithDeploymentArgs<SimpleProxy__factory>;
}> {
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

  // deploy vesting vault behind a proxy so it's upgradeable
  const simpleProxyFactory = new SimpleProxy__factory(signer);
  const vestingVaultProxyDeploymentArgs: DeployArguments<SimpleProxy__factory> =
    [proxyOwnerAddress, vestingVault.address];

  const vestingVaultProxy = await simpleProxyFactory.deploy(
    ...vestingVaultProxyDeploymentArgs,
  );
  await vestingVaultProxy.deployTransaction.wait(1);
  console.log("Deployed VestingVault proxy");

  return {
    vestingVault: {
      address: vestingVault.address,
      name: "VestingVault",
      contract: vestingVault,
      deploymentArgs,
    },
    vestingVaultProxy: {
      address: vestingVaultProxy.address,
      name: "VestingVaultProxy",
      contract: vestingVaultProxy,
      deploymentArgs: vestingVaultProxyDeploymentArgs,
    },
  };
}
