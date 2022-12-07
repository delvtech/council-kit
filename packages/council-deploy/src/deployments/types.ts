export interface DeploymentsJsonFile {
  chainId: number;
  deployments: DeploymentInfo[];
}

export interface DeploymentInfo {
  timestamp: number;
  name: string;
  signer: string;
  contracts: {
    address: string;
    name: string;
    deploymentArgs: unknown[];
  }[];
}
