import {
  LockingVault__factory,
  SimpleProxy__factory,
} from "@council/typechain";
import { Signer } from "ethers";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

interface DeployLockingVaultOptions {
  signer: Signer;
  votingTokenAddress: string;
  proxyOwnerAddress: string;
  /**
   * A user's vote power can be used on proposal for this long after the
   * proposal is created.
   */
  staleBlockLag: number;
}

export async function deployLockingVault({
  signer,
  votingTokenAddress,
  proxyOwnerAddress,
  staleBlockLag,
}: DeployLockingVaultOptions): Promise<{
  lockingVault: ContractWithDeploymentArgs<LockingVault__factory>;
  lockingVaultProxy: ContractWithDeploymentArgs<SimpleProxy__factory>;
}> {
  const lockingVaultFactory = new LockingVault__factory(signer);
  const lockingVaultDeploymentArgs: DeployArguments<LockingVault__factory> = [
    votingTokenAddress,
    staleBlockLag,
  ];
  const lockingVault = await lockingVaultFactory.deploy(
    ...lockingVaultDeploymentArgs,
  );
  await lockingVault.deployTransaction.wait(1);
  console.log("Deployed LockingVault");

  // deploy locking vault behind a proxy so it's upgradeable
  const simpleProxyFactory = new SimpleProxy__factory(signer);
  const lockingVaultProxyDeploymentArgs: DeployArguments<SimpleProxy__factory> =
    [proxyOwnerAddress, lockingVault.address];

  const lockingVaultProxy = await simpleProxyFactory.deploy(
    ...lockingVaultProxyDeploymentArgs,
  );
  await lockingVaultProxy.deployTransaction.wait(1);
  console.log("Deployed LockingVault proxy");

  return {
    lockingVault: {
      address: lockingVault.address,
      name: "LockingVault",
      contract: lockingVault,
      deploymentArgs: lockingVaultDeploymentArgs,
    },
    lockingVaultProxy: {
      address: lockingVaultProxy.address,
      name: "LockingVaultProxy",
      contract: lockingVaultProxy,
      deploymentArgs: lockingVaultProxyDeploymentArgs,
    },
  };
}
