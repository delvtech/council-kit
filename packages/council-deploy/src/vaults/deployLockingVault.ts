import {
  LockingVault__factory,
  SimpleProxy,
  SimpleProxy__factory,
} from "@council/typechain";
import { Signer } from "ethers";

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
}: DeployLockingVaultOptions): Promise<SimpleProxy> {
  const lockingVaultDeployer = new LockingVault__factory(signer);
  const lockingVaultBaseContract = await lockingVaultDeployer.deploy(
    votingTokenAddress,
    staleBlockLag,
  );
  console.log("Deployed LockingVault");

  // deploy locking vault behind a proxy so it's upgradeable
  const proxyDeployer = new SimpleProxy__factory(signer);

  const lockingVaultProxy = await proxyDeployer.deploy(
    proxyOwnerAddress,
    lockingVaultBaseContract.address,
  );

  const lockingVaultContract = lockingVaultProxy.attach(
    lockingVaultProxy.address,
  );
  console.log("Deployed LockingVault proxy");

  return lockingVaultContract;
}
