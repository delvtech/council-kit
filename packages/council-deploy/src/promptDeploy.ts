import hre from "hardhat";
import { deployCouncil } from "src/deployCouncil";
import prompt from "prompt";
import { DeploymentsJsonFile } from "src/deployments/types";
import { writeFile } from "src/base/writeFile";
import { etherscanVerifyContracts } from "src/etherscan/verifyContract";
import { getDeploymentsFile, getDeploymentsFileName } from "./deployments";

async function promptDeploy() {
  const signers = await hre.ethers.getSigners();
  const signer = signers[0];

  const chainId = hre.network.config.chainId;
  const networkName = hre.network.name;
  const deploymentsFile = await getDeploymentsFile(networkName, chainId);

  console.log({
    chainId,
    networkName,
  });

  // Get a deployment name from the user
  prompt.start();
  const { deploymentName } = await prompt.get({
    description: "Name this deployment",
    name: "deploymentName",
    default: `${hre.network.name} Deployment #${
      deploymentsFile.deployments.length + 1
    }`,
  });

  const deploymentsFileName = getDeploymentsFileName(networkName);

  // Deploy the contracts
  const contractDeployments = await deployCouncil(signer);

  writeFile<DeploymentsJsonFile>(`./src/deployments/${deploymentsFileName}`, {
    ...deploymentsFile,
    deployments: [
      ...deploymentsFile.deployments,
      {
        name: deploymentName as string,
        timestamp: Date.now(),
        signer: signer.address,
        contracts: contractDeployments.map(
          ({ address, name, deploymentArgs }) => ({
            address,
            name,
            deploymentArgs,
          }),
        ),
      },
    ],
  });
  console.log(`Updated ${deploymentsFileName}!`);

  if (chainId && chainId !== 31337) {
    // Verifying contracts on etherscan at the end of this script is faster since
    // it takes time for etherscan to index new contracts. Generally, it's good to
    // wait a few blocks after a contract is deployed before trying to verify it.
    console.log("Verifying contracts on etherscan...");
    await etherscanVerifyContracts(contractDeployments);
  }
}

promptDeploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
