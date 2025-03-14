import { z } from "zod";
import { Address, HexString } from "../lib/zod.js";
import { JsonStore } from "../utils/JsonStore.js";

const DeployedContractInfo = z.object({
  name: z.string(),
  address: Address,
  deployTransaction: HexString,
  deployArgs: z.array(z.unknown()),
  bytecode: HexString,
});
export type DeployedContractInfo = z.infer<typeof DeployedContractInfo>;

const DeploymentInfo = z.object({
  name: z.string(),
  chainId: z.number(),
  deployer: Address,
  contracts: DeployedContractInfo.array(),
});
export type DeploymentInfo = z.infer<typeof DeploymentInfo>;

export function getDeploymentJson({
  name,
  chainId,
  outDir,
}: {
  name: string;
  chainId: number;
  outDir: string;
}) {
  return new JsonStore({
    path: outDir,
    name: `${chainId}-${name}`,
    schema: DeploymentInfo,
    defaults: {
      name,
      chainId,
      deployer: "0x",
      contracts: [],
    },
  });
}
