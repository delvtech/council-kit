import { Wallet } from "ethers";
import hre from "hardhat";
import { deployCouncil } from "src/deployCouncil";
import prompt from "prompt";
import goerliDeployments from "src/deployments/goerli.deployments.json";
import { DeploymentsJsonFile } from "src/deployments/types";
import { writeFile } from "src/base/writeFile";
import { etherscanVerifyContracts } from "src/etherscan/verifyContract";

const goerliKey = process.env.GOERLI_DEPLOYER_PRIVATE_KEY;

async function deployGoerli() {
  const provider = hre.ethers.provider;
  if (!goerliKey) {
    console.log("no private key for goerli deployer address provided");
    return;
  }
  const signer = new Wallet(goerliKey, provider);

  // Get a deployment name from the user
  prompt.start();
  const { deploymentName } = await prompt.get({
    description: "Name this deployment",
    name: "deploymentName",
    default: `Goerli Deployment #${goerliDeployments.deployments.length + 1}`,
  });

  // Deploy the contracts
  const contractDeployments = await deployCouncil(signer);

  writeFile<DeploymentsJsonFile>(`./src/deployments/goerli.deployments.json`, {
    ...goerliDeployments,
    deployments: [
      ...goerliDeployments.deployments,
      {
        name: deploymentName as string,
        timestamp: Date.now(),
        signer: signer.address,
        contracts: contractDeployments.map(
          ({ address, name, type, deploymentArgs }) => ({
            address,
            name,
            type,
            deploymentArgs,
          }),
        ),
      },
    ],
  });
  console.log("Updated goerli.deployments.json!");

  // Verifying contracts on etherscan at the end of this script is faster since
  // it takes time for etherscan to index new contracts. Generally, it's good to
  // wait a few blocks after a contract is deployed before trying to verify it.
  console.log("Verifying contracts on etherscan...");
  await etherscanVerifyContracts(contractDeployments);
}

deployGoerli()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
