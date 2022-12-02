import { Wallet } from "ethers";
import hre from "hardhat";
import { writeFile } from "src/base/writeFile";
import { deployCouncil } from "src/deployCouncil";
import prompt from "prompt";
import goerliDeployments from "src/deployments/goerli.deployments.json";
import { DeploymentInfo, DeploymentsJsonFile } from "src/deployments/types";

const goerliKey = process.env.GOERLI_DEPLOYER_PRIVATE_KEY;

async function main() {
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

  const councilAddresses = await deployCouncil(signer);
  const newDeployment: DeploymentInfo = {
    name: deploymentName as string,
    timestamp: Date.now(),
    addresses: councilAddresses,
  };
  console.log(newDeployment);

  const updatedFile: DeploymentsJsonFile = {
    ...goerliDeployments,
    deployments: [...goerliDeployments.deployments, newDeployment],
  };

  writeFile(updatedFile, `./src/deployments/goerli.deployments.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
