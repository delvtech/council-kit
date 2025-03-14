import { ConstructorArgs, prepareParamsArray } from "@delvtech/drift";
import signale from "signale";
import {
  Abi,
  Account,
  Chain,
  Hex,
  PublicClient,
  Transport,
  WalletClient,
} from "viem";
import { config } from "../config.js";
import { stringifyBigInts } from "../utils/stringifyBigInts.js";
import { DeployedContractInfo, getDeploymentJson } from "./DeploymentJson.js";

export const DEFAULT_DEPLOYMENTS_DIR =
  config.get("deploymentsDir") || "./deployments";

export interface DeployerOptions {
  publicClient: PublicClient<Transport, Chain>;
  walletClient: WalletClient<Transport, Chain, Account>;
}

export class Deployer {
  #publicClient: PublicClient<Transport, Chain>;
  #walletClient: WalletClient<Transport, Chain, Account>;
  #deployedContracts: DeployedContractInfo[] = [];
  #savedPaths: Set<string> = new Set();

  constructor({ publicClient, walletClient }: DeployerOptions) {
    this.#publicClient = publicClient;
    this.#walletClient = walletClient;
  }

  get deployedContracts(): DeployedContractInfo[] {
    return this.#deployedContracts;
  }

  get savedPaths(): Set<string> {
    return this.#savedPaths;
  }

  async deploy<TAbi extends Abi>({
    name,
    abi,
    args,
    bytecode,
    onSubmitted,
  }: {
    name: string;
    abi: TAbi;
    args: ConstructorArgs<TAbi>;
    bytecode: Hex;
    onSubmitted?: (txHash: string) => void;
  }): Promise<DeployedContractInfo> {
    signale.pending(`Deploying ${name}...`);

    const { params } = prepareParamsArray({
      abi,
      kind: "inputs",
      type: "constructor",
      name: undefined as any,
      value: args,
    });

    const hash = await this.#walletClient.deployContract({
      abi,
      args: params,
      bytecode,
      account: this.#walletClient.account,
    } as any);
    onSubmitted?.(hash);

    signale.pending(`${name} deployment tx submitted: ${hash}`);

    const { contractAddress } =
      await this.#publicClient.waitForTransactionReceipt({
        hash,
      });

    if (!contractAddress) {
      throw new Error(
        `No contract address found in receipt for ${name} deployment tx: ${hash}`,
      );
    }

    signale.success(`${name} deployed @ ${contractAddress}`);

    const info: DeployedContractInfo = {
      name,
      address: contractAddress,
      deployTransaction: hash,
      deployArgs: stringifyBigInts(params),
      bytecode,
    };

    this.#deployedContracts.push(info);
    return info;
  }

  /**
   * Save information about the deployed contracts to a json file.
   * @returns The path to the saved deployment information.
   */
  save({
    name,
    outDir = DEFAULT_DEPLOYMENTS_DIR,
  }: {
    /** The name of the deployment. */
    name: string;
    /** The directory to save the deployment information to. */
    outDir?: string;
  }): string {
    const chainId = this.#walletClient.chain.id;
    const json = getDeploymentJson({ name, chainId, outDir });

    signale.pending(`Saving deployment info to: ${json.path}`);

    json.set({
      deployer: this.#walletClient.account.address,
      contracts: this.#deployedContracts,
    });

    signale.success(`Deployment info saved to: ${json.path}`);

    this.#savedPaths.add(json.path);
    return json.path;
  }
}
