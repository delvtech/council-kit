import { JSONStore } from "src/utils/JSONStore";

export const DEFAULT_DEPLOYMENTS_DIR = "./deployments";

export interface ContractInfo {
  address: string;
  name: string;
  deploymentTransactionHash?: string;
  deploymentArgs?: any[];
}

export interface DeploymentInfo {
  name: string;
  chainId: number;
  timestamp?: number;
  deployer?: string;
  contracts: ContractInfo[];
}

export function getDeploymentStore(
  name: string,
  chainId: number,
  deploymentsDir = DEFAULT_DEPLOYMENTS_DIR,
): JSONStore<DeploymentInfo> {
  return new JSONStore<DeploymentInfo>({
    path: deploymentsDir,
    name: `${name}-${chainId}`,
    defaults: {
      name,
      chainId,
      contracts: [],
    },
    schema: {
      name: {
        type: "string",
      },
      chainId: {
        type: "number",
      },
      timestamp: {
        type: "number",
      },
      deployer: {
        type: "string",
      },
      contracts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            address: {
              type: "string",
            },
            deploymentTransactionHash: {
              type: "string",
            },
            deploymentArgs: {
              type: "array",
            },
          },
        },
      },
    },
  });
}
