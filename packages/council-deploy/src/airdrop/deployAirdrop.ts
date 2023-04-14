import { Signer } from "ethers";
import { Airdrop__factory } from "@council/typechain";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

interface DeployAirdropOptions {
  signer: Signer;
  ownerAddress: string;
  merkleRoot: string;
  tokenAddress: string;
  expirationTimestamp: number;
  lockingVaultAddress: string;
}

export async function deployAirdrop({
  signer,
  ownerAddress,
  merkleRoot,
  tokenAddress,
  expirationTimestamp,
  lockingVaultAddress,
}: DeployAirdropOptions): Promise<
  ContractWithDeploymentArgs<Airdrop__factory>
> {
  console.log("Deploying Airdrop...");
  const airdropFactory = new Airdrop__factory(signer);
  const deploymentArgs: DeployArguments<Airdrop__factory> = [
    ownerAddress,
    merkleRoot,
    tokenAddress,
    expirationTimestamp,
    lockingVaultAddress,
  ];
  const airdrop = await airdropFactory.deploy(...deploymentArgs);
  await airdrop.deployTransaction.wait(1);
  console.log(`Deployed Airdrop @ ${airdrop.address}`);

  return {
    address: airdrop.address,
    name: "Airdrop",
    contract: airdrop,
    deploymentArgs,
  };
}
