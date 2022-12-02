export interface DeploymentsJsonFile {
  chainId: number;
  deployments: DeploymentInfo[];
}

export interface DeploymentInfo {
  timestamp: number;
  name: string;
  addresses: Record<string, string>;
}
