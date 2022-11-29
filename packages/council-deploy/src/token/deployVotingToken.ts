import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MockERC20, MockERC20__factory } from "@council/typechain";

interface DeployVotingTokenOptions {
  tokenName: string;
  tokenSymbol: string;
  signer: SignerWithAddress;
}

export async function deployVotingToken({
  tokenName,
  tokenSymbol,
  signer,
}: DeployVotingTokenOptions): Promise<MockERC20> {
  const tokenDeployer = new MockERC20__factory(signer);
  const votingToken = await tokenDeployer.deploy(
    tokenName,
    tokenSymbol,
    signer.address,
  );
  console.log("Deployed VotingToken");

  return votingToken;
}
