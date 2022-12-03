export interface DeploymentsJsonFile {
  chainId: number;
  deployments: DeploymentInfo[];
}

export interface DeploymentInfo {
  timestamp: number;
  name: string;
  contracts: {
    [contractName: string]: {
      address: string;
      deploymentArgs: unknown[];
    };
  };
}
