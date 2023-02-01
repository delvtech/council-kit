import { ContractDeploymentInfo, DeploymentInfo } from "src/deployments/types";

export function getVotingTokens(
  deployments: DeploymentInfo[],
): ContractDeploymentInfo[] {
  const allDeployedContracts = deployments
    .map((deployment) => deployment.contracts)
    .flat();

  return allDeployedContracts.filter(
    (deployedContract) => deployedContract.name === "VotingToken",
  );
}
