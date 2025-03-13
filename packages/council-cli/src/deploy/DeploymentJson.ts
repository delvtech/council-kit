import { z } from "zod";
import { Hex } from "../lib/zod.js";
import { JsonStore } from "../utils/JsonStore.js";

const DeployedContractInfo = z.object({
  name: z.string(),
  address: Hex,
  deployTransaction: Hex,
  deployArgs: z.array(z.unknown()),
  bytecode: Hex,
});
export type DeployedContractInfo = z.infer<typeof DeployedContractInfo>;

const DeploymentInfo = z.object({
  name: z.string(),
  chainId: z.number(),
  deployer: Hex,
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
