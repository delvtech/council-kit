import { writeFile } from "src/base/writeFile";
import { DeploymentInfo, DeploymentsJsonFile } from "src/deployments/types";

export function getDeploymentsFileName(networkName: string): string {
  return `${networkName}.deployments.json`;
}

export async function getDeploymentsFile(
  networkName: string,
  chainId: number | undefined,
): Promise<DeploymentsJsonFile> {
  const fileName = getDeploymentsFileName(networkName);

  const fileImport = await import(`src/deployments/${fileName}`).catch(() => {
    const defaultDeploymentsFile = {
      chainId: chainId ?? 0,
      deployments: [],
    };
    writeFile<DeploymentsJsonFile>(
      `./src/deployments/${fileName}`,
      defaultDeploymentsFile,
    );
    return {
      default: defaultDeploymentsFile,
    };
  });

  return fileImport.default;
}

/**
 * Finds the deployment that the given contract is in.
 */
export function getDeploymentForContract(
  contractAddress: string,
  deployments: DeploymentInfo[],
): DeploymentInfo | undefined {
  const deployment = deployments.find((deployment) =>
    deployment.contracts.find(({ address }) => address === contractAddress),
  );

  return deployment;
}
