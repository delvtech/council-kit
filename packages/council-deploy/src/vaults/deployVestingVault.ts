import {
  SimpleProxy__factory,
  VestingVault__factory,
} from "@council/typechain";
import { Signer } from "ethers";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

interface DeployVestingVaultOptions {
  signer: Signer;
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
  console.log("Deploying VestingVault...");
  const signerAddress = await signer.getAddress();
  const vestingVaultFactory = new VestingVault__factory(signer);
  const deploymentArgs: DeployArguments<VestingVault__factory> = [
    votingTokenAddress,
    staleBlockLag,
  ];
  const vestingVault = await vestingVaultFactory.deploy(...deploymentArgs);
  await vestingVault.deployTransaction.wait(1);
  console.log(`Deployed VestingVault @ ${vestingVault.address}`);

  console.log("Initializing VestingVault...");
  const init = await vestingVault.initialize(signerAddress, signerAddress);
  await init.wait(1);

  // Only the Timelock can update things like the unvestedMultiplier.
  console.log("Setting timelock permissions on VestingVault...");
  const timelock = await vestingVault.setTimelock(timelockAddress);
  await timelock.wait(1);

  // deploy vesting vault behind a proxy so it's upgradeable
  console.log("Deploying VestingVault proxy...");
  const simpleProxyFactory = new SimpleProxy__factory(signer);
  const vestingVaultProxyDeploymentArgs: DeployArguments<SimpleProxy__factory> =
    [proxyOwnerAddress, vestingVault.address];

  const vestingVaultProxy = await simpleProxyFactory.deploy(
    ...vestingVaultProxyDeploymentArgs,
  );
  await vestingVaultProxy.deployTransaction.wait(1);
  console.log(`Deployed VestingVault proxy @ ${vestingVaultProxy.address}`);

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
