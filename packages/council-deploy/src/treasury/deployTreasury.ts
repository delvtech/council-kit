import { Treasury__factory } from "@council/typechain";
import { Wallet } from "ethers";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

interface DeployTreasuryOptions {
  signer: Wallet;
  ownerAddress: string;
}

export async function deployTreasury({
  signer,
  ownerAddress,
}: DeployTreasuryOptions): Promise<
  ContractWithDeploymentArgs<Treasury__factory>
> {
  const treasuryFactory = new Treasury__factory(signer);
  const deploymentArgs: DeployArguments<Treasury__factory> = [ownerAddress];
  const treasury = await treasuryFactory.deploy(...deploymentArgs);
  console.log("Deployed Treasury");

  return {
    address: treasury.address,
    contract: treasury,
    deploymentArgs,
  };
}
