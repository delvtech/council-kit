import { DeploymentInfo } from "src/deployments/types";

export function formatVotingTokenTable(deployments: DeploymentInfo[]): {
  "Deployment Name": string;
  "Token Name": string;
  "Contract Address": string;
}[] {
  return deployments
    .map((deployment) => {
      const votingTokens = deployment.contracts.filter(
        (contract) => contract.type === "ERC20",
      );

      return votingTokens.map((votingToken) => ({
        "Deployment Name": deployment.name,
        "Token Name": votingToken.name,
        "Contract Address": votingToken.address,
      }));
    })
    .flat();
}
