import { Address, Bytes, HexString } from "@delvtech/drift";
import { JsonStore } from "../utils/config/JsonStore.js";

export type DeploymentJson = JsonStore<DeploymentInfo>;

export function getDeploymentJson({
  name,
  chainId,
  outDir,
}: {
  name: string;
  chainId: number;
  outDir: string;
}): DeploymentJson {
  return new JsonStore<DeploymentInfo>({
    path: outDir,
    name: `${chainId}-${name}`,
    defaults: {
      name,
      chainId,
      deployer: "0x",
      contracts: [],
    },
    schema: {
      name: {
        type: "string",
      },
      chainId: {
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

export interface DeploymentInfo {
  name: string;
  chainId: number;
  deployer: Address;
  contracts: DeployedContractInfo[];
}

export interface DeployedContractInfo {
  name: string;
  address: Address;
  deployTransaction: HexString;
  deployArgs: any[];
  bytecode: Bytes;
}
