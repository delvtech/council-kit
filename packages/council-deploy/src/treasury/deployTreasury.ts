import { Treasury__factory } from "@council/typechain";
import { Signer } from "ethers";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

interface DeployTreasuryOptions {
  signer: Signer;
  ownerAddress: string;
}

export async function deployTreasury({
  signer,
  ownerAddress,
}: DeployTreasuryOptions): Promise<
  ContractWithDeploymentArgs<Treasury__factory>
> {
  console.log("Deploying Treasury...");
  const treasuryFactory = new Treasury__factory(signer);
  const deploymentArgs: DeployArguments<Treasury__factory> = [ownerAddress];
  const treasury = await treasuryFactory.deploy(...deploymentArgs);
  await treasury.deployTransaction.wait(1);
  console.log(`Deployed Treasury @ ${treasury.address}`);

  return {
    address: treasury.address,
    name: "Treasury",
    contract: treasury,
    deploymentArgs,
  };
}
