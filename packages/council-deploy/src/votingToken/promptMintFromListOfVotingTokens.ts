import { MockERC20__factory } from "@council/typechain";
import { Wallet } from "ethers";
import hre from "hardhat";
import prompt from "prompt";
import { promptString } from "src/base/prompts/promptString";
import { getDeploymentForContract, goerliDeployments } from "src/deployments";
import { DeploymentInfo } from "src/deployments/types";
import { getVotingTokens } from "src/votingToken/getVotingTokens";
import { promptMint } from "src/votingToken/promptMint";

const goerliKey = process.env.GOERLI_DEPLOYER_PRIVATE_KEY;

const allVotingTokens = getVotingTokens(goerliDeployments);
const votingTokensTable = allVotingTokens.map((votingToken) => ({
  "Deployment name": (
    getDeploymentForContract(
      votingToken.address,
      goerliDeployments,
    ) as DeploymentInfo
  ).name,
  "Voting token address": votingToken.address,
}));

async function mintFromListOfVotingTokens() {
  const provider = hre.ethers.provider;
  if (!goerliKey) {
    console.log("No private key for goerli deployer address provided");
    return;
  }

  const signer = new Wallet(goerliKey, provider);

  console.table(votingTokensTable);
  prompt.start();
  const votingTokenAddress = await promptString({
    message: "Enter a voting token address",
    choices: allVotingTokens.map(({ address }) => address),
  });

  const votingTokenContract = MockERC20__factory.connect(
    votingTokenAddress,
    signer,
  );

  const recipientAddress = await promptString({
    message:
      "Enter the recipient's address (Defaults to Goerli Deployer from .env)",
    defaultValue: signer.address,
  });

  await promptMint(votingTokenContract, recipientAddress as string);
}

mintFromListOfVotingTokens()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
