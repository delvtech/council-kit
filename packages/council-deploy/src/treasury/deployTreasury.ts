import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Treasury, Treasury__factory } from "@council/typechain";

interface DeployTreasuryOptions {
  signer: SignerWithAddress;
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
