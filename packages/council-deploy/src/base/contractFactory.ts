import { ContractFactory } from "ethers";

/**
 * The required constructor args for deploying a contract. Useful when verifying
 * contracts on etherscan.
 */
export type DeployArguments<TContractFactory extends ContractFactory> =
  Parameters<TContractFactory["deploy"]>;

/**
 * The contract type the factory will deploy.
 */
export type ContractFromFactory<TContractFactory extends ContractFactory> =
  Awaited<ReturnType<TContractFactory["deploy"]>>;

/**
 * An envelope containing the contract and the deployment args for a given
 * contract factory.
 */

export interface ContractWithDeploymentArgs<
  TContractFactory extends ContractFactory,
> {
  address: string;
  contract: ContractFromFactory<TContractFactory>;
  deploymentArgs: DeployArguments<TContractFactory>;
}
