import { ContractDeploymentInfo, DeploymentInfo } from "src/deployments/types";

export function getLockingVaults(
  deployments: DeploymentInfo[],
): ContractDeploymentInfo[] {
  const allDeployedContracts = deployments
    .map((deployment) => deployment.contracts)
    .flat();

  return allDeployedContracts.filter(
    (deployedContract) => deployedContract.type === "LockingVault",
  );
}
