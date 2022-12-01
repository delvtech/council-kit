export interface DeploymentsJsonFile {
  chainId: number;
  deployments: DeploymentInfo[];
}

interface DeploymentInfo {
  timestamp: number;
  name: string;
  addresses: Record<string, string>;
}
