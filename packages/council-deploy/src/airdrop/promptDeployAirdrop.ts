import {
  LockingVault,
  LockingVault__factory,
  MockERC20,
  MockERC20__factory,
} from "@council/typechain";
import { BigNumber, Signer } from "ethers";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
import prompt from "prompt";
import {
  getDeploymentForContract,
  getDeploymentsFile,
  getDeploymentsFileName,
} from "src/deployments/getDeployments";
import { promptString } from "src/base/prompts/promptString";
import { promptNumber } from "src/base/prompts/promptNumber";
import { getLockingVaults } from "src/vaults/lockingVault/getLockingVaults";
import { promptYesNo } from "src/base/prompts/promptYesNo";
import { DeploymentInfo, DeploymentsJsonFile } from "src/deployments/types";
import MerkleTree from "merkletreejs";
import { deployAirdrop } from "./deployAirdrop";
import { ethers, network } from "hardhat";
import path from "node:path";
import { writeFile } from "src/base/writeFile";
import { etherscanVerifyContract } from "src/etherscan/verifyContract";

async function airdropDeployPrompt() {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  const chainId = network.config.chainId;

  const deploymentsFile = await getDeploymentsFile(network.name, chainId);

  console.log(deploymentsFile);

  prompt.start();

  const { token, tokenAddress, vaultAddress } = await promptAirdropVault(
    signer,
    deploymentsFile,
  );

  const ownerAddress = await promptString({
    message:
      "Airdrop owner's address (e.g., Timelock's address, CoreVoting's address)",
  });

  const tokenDecimals = await token.decimals();
  const tokenSymbol = await token.symbol();
  const merkleRoot = await promptMerkleProof(tokenDecimals, tokenSymbol);

  const expirationTimestamp = await promptNumber({
    message: "Expiration Timestamp (unix timestamp in seconds)",
  });

  // confirm the token of the locking vault
  const isConfirmed = await promptYesNo({
    message: `Set expiration date to ${new Date(+expirationTimestamp * 1000)}?`,
  });

  if (!isConfirmed) {
    return;
  }

  const { contract, address, deploymentArgs, name } = await deployAirdrop({
    signer,
    ownerAddress,
    merkleRoot,
    tokenAddress,
    expirationTimeStamp: +expirationTimestamp,
    lockingVaultAddress: vaultAddress,
  });

  const fullProtocolDeployment = deploymentsFile.deployments.find(
    ({ contracts }) =>
      contracts.find(({ address }) => address === vaultAddress),
  );

  if (fullProtocolDeployment) {
    fullProtocolDeployment.contracts.push({
      address,
      deploymentArgs,
      name,
    });
  } else {
    deploymentsFile.deployments.push({
      name: `Airdrop deploy for ${vaultAddress}`,
      timestamp: Date.now(),
      signer: signer.address,
      contracts: [],
    });
  }

  const deploymentsFileName = getDeploymentsFileName(network.name);
  writeFile(`./src/deployments/${deploymentsFileName}`, deploymentsFile);

  if (chainId && chainId !== 31337) {
    // Verifying contracts on etherscan at the end of this script is faster since
    // it takes time for etherscan to index new contracts. Generally, it's good to
    // wait a few blocks after a contract is deployed before trying to verify it.
    console.log("Verifying airdrop contract on etherscan...");
    await etherscanVerifyContract(contract, deploymentArgs);
  }
}

// Get the locking vault and confirm the token of the locking vault.
async function promptAirdropVault(
  signer: Signer,
  deploymentsFile?: DeploymentsJsonFile,
): Promise<{
  token: MockERC20;
  tokenAddress: string;
  vault: LockingVault;
  vaultAddress: string;
}> {
  if (deploymentsFile) {
    const allLockingVaults = getLockingVaults(deploymentsFile.deployments);
    const lockingVaultsTable = allLockingVaults.map((lockingVault) => ({
      "Deployment name": (
        getDeploymentForContract(
          lockingVault.address,
          deploymentsFile.deployments,
        ) as DeploymentInfo
      ).name,
      "LockingVault address": lockingVault.address,
    }));

    console.table(lockingVaultsTable);
  }

  const vaultAddress = await promptString({
    message: "LockingVault address",
  });
  const vault = LockingVault__factory.connect(vaultAddress, signer);

  const tokenAddress = await vault.token();
  const token = MockERC20__factory.connect(tokenAddress, signer);
  const tokenSymbol = await token.symbol();

  // confirm the token of the locking vault
  const isConfirmed = await promptYesNo({
    message: `Deploy airdrop for ${tokenSymbol} (${tokenAddress})?`,
  });

  if (!isConfirmed) {
    return promptAirdropVault(signer, deploymentsFile);
  }

  return { token, tokenAddress, vault, vaultAddress };
}

async function promptMerkleProof(
  tokenDecimals: number,
  tokenSymbol: string,
): Promise<string> {
  const accountsImport = await import("./accounts/accounts.json").catch(() => {
    console.error(
      `No accounts JSON found. Save your accounts JSON as ${path.resolve(
        __dirname,
        "./accounts/accounts.json and rerun.",
      )}`,
    );
    process.exit(1);
  });

  const accounts = accountsImport.default;

  const uniqueAddresses = new Set(accounts.map(({ address }) => address));
  const valueTotal = accounts.reduce(
    (sum, { value }) => sum.add(parseUnits(value, tokenDecimals)),
    BigNumber.from(0),
  );

  // confirm the token of the locking vault
  const isConfirmed = await promptYesNo({
    message: `Deploy airdrop for ${
      uniqueAddresses.size
    } accounts totaling ${commify(
      formatUnits(valueTotal, tokenDecimals),
    )} ${tokenSymbol}?`,
  });

  if (!isConfirmed) {
    process.exit(0);
  }

  return getMerkleTree(accounts, tokenDecimals).getHexRoot();
}

export interface Account {
  address: string;
  value: string;
}

function getMerkleTree(accounts: Account[], tokenDecimals: number) {
  const leaves = accounts.map((account) => hashAccount(account, tokenDecimals));
  return new MerkleTree(leaves, merkleHashFn, {
    hashLeaves: false,
    sortPairs: true,
  });
}

function hashAccount({ address, value }: Account, tokenDecimals: number) {
  return ethers.utils.solidityKeccak256(
    ["address", "uint256"],
    [address, parseUnits(value, tokenDecimals)],
  );
}

function merkleHashFn(bytes: Buffer) {
  return ethers.utils.solidityKeccak256(["bytes"], [bytes]);
}

airdropDeployPrompt()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
