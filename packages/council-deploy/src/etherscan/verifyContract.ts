import { Contract, ContractFactory } from "ethers";
import hre from "hardhat";
import { DeployArguments } from "src/base/contractFactory";
import { delay } from "src/base/time";

// Number of blocks to wait before attempting to verify on etherscan.
const WAIT_BLOCK_CONFIRMATIONS = 6;

export async function etherscanVerifyContracts(
  contracts: { contract: Contract; deploymentArgs: unknown[] }[],
): Promise<void[]> {
  return Promise.all(
    contracts.map(async ({ contract, deploymentArgs }) => {
      // etherscan's FREE tier allows 5 api calls per second, so we should wait
      // a little bit before each attempt to verify a contract
      await delay(5000);
      return etherscanVerifyContract(contract, deploymentArgs);
    }),
  );
}

export async function etherscanVerifyContract<T extends ContractFactory>(
  contract: Contract,
  constructorArguments: DeployArguments<T>,
): Promise<void> {
  // wait a couple of blocks so etherscan has enough time to index this
  // contract, then attempt to verify it on Etherscan
  await contract.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
  try {
    await hre.run("verify:verify", {
      address: contract.address,
      constructorArguments,
    });
  } catch (error) {
    console.log(error);
  }
}
