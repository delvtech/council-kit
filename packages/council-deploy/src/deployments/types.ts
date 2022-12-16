export interface DeploymentsJsonFile {
  chainId: number;
  deployments: DeploymentInfo[];
}

export interface ContractDeploymentInfo {
  address: string;
  name: string;
  type: string;
  deploymentArgs: unknown[];
}

export interface DeploymentInfo {
  timestamp: number;
  name: string;
  signer: string;
  contracts: ContractDeploymentInfo[];
}
