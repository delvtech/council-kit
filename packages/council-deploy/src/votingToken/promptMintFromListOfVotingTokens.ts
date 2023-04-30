import { MockERC20__factory } from "@council/typechain";
import { ethers, network } from "hardhat";
import prompt from "prompt";
import { promptString } from "src/base/prompts/promptString";
import { goerliDeployments } from "src/deployments";
import {
  getDeploymentForContract,
  getDeploymentsFile,
} from "src/deployments/getDeployments";
import { DeploymentInfo } from "src/deployments/types";
import { getVotingTokens } from "src/votingToken/getVotingTokens";
import { promptMint } from "src/votingToken/promptMint";

async function mintFromListOfVotingTokens() {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  const chainId = network.config.chainId;

  const deploymentsFile = await getDeploymentsFile(network.name, chainId);
  const deployments = deploymentsFile.deployments;
  const allVotingTokens = getVotingTokens(deployments);
  const votingTokensTable = allVotingTokens.map((votingToken) => ({
    "Deployment name": (
      getDeploymentForContract(
        votingToken.address,
        deployments,
      ) as DeploymentInfo
    ).name,
    "Voting token address": votingToken.address,
  }));

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
    message: "Enter the recipient's address",
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
