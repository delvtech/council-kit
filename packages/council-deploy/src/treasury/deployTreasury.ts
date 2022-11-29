import { Treasury, Treasury__factory } from "@council/typechain";
import { Wallet } from "ethers";

interface DeployTreasuryOptions {
  signer: Wallet;
  ownerAddress: string;
}

export async function deployTreasury({
  signer,
  ownerAddress,
}: DeployTreasuryOptions): Promise<Treasury> {
  const treasuryDeployer = new Treasury__factory(signer);
  const treasuryContract = await treasuryDeployer.deploy(ownerAddress);
  console.log("Deployed Treasury");

  return treasuryContract;
}
