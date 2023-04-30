import { LockingVault__factory, MockERC20__factory } from "@council/typechain";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { ethers, network } from "hardhat";
import prompt from "prompt";
import {
  getDeploymentForContract,
  getDeploymentsFile,
} from "src/deployments/getDeployments";
import { promptString } from "src/base/prompts/promptString";
import { promptMint } from "src/votingToken/promptMint";
import { promptNumber } from "src/base/prompts/promptNumber";
import { getLockingVaults } from "src/vaults/lockingVault/getLockingVaults";
import { makeGoerliTransactionUrl } from "src/etherscan/urls";
import { promptYesNo } from "src/base/prompts/promptYesNo";
import { DeploymentInfo } from "src/deployments/types";

async function promptChooseLockingVaultAndDepositTokens() {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  const chainId = network.config.chainId;

  const deploymentsFile = await getDeploymentsFile(network.name, chainId);
  const deployments = deploymentsFile.deployments;
  const allLockingVaults = getLockingVaults(deployments);
  const lockingVaultsTable = allLockingVaults.map((lockingVault) => ({
    "Deployment name": (
      getDeploymentForContract(
        lockingVault.address,
        deployments,
      ) as DeploymentInfo
    ).name,
    "LockingVault address": lockingVault.address,
  }));

  prompt.start();

  // choose a locking vault
  console.table(lockingVaultsTable);
  const vaultAddress = await promptString({
    message: "Enter a LockingVault address",
    choices: allLockingVaults.map(({ address }) => address),
  });
  const vaultContract = LockingVault__factory.connect(vaultAddress, signer);

  // if user has no tokens, offer to mint them some
  const votingTokenAddress = await vaultContract.token();
  const votingToken = MockERC20__factory.connect(votingTokenAddress, signer);
  if ((await votingToken.balanceOf(signer.address)).isZero()) {
    const shouldMint = await promptYesNo({
      message:
        "Your wallet does not contain any tokens available to deposit, would you like to mint some?",
    });

    if (!shouldMint) {
      console.log("No tokens to deposit.");
      return;
    }

    await promptMint(votingToken, signer.address);
  }

  // Ask the user for the amount of tokens to deposit
  const balanceAvailableToDeposit = await votingToken.balanceOf(signer.address);
  const decimals = await votingToken.decimals();
  const tokenSymbol = await votingToken.symbol();
  const formattedWalletBalance = formatUnits(
    balanceAvailableToDeposit,
    decimals,
  );
  const [, balanceInVault] = await vaultContract.deposits(signer.address);
  const formattedVaultBalance = formatUnits(balanceInVault, decimals);
  const amountToDeposit = await promptNumber({
    message: `Amount to deposit (Wallet balance: ${formattedWalletBalance} ${tokenSymbol}, Vault balance: ${formattedVaultBalance} ${tokenSymbol})`,
    max: formattedWalletBalance,
  });
  const amountToDepositBigNumber = parseUnits(
    amountToDeposit.toString(),
    decimals,
  );

  // set an allowance for the LockingVault to access the user's tokens
  const allowance = await votingToken.allowance(signer.address, vaultAddress);
  if (allowance.lt(amountToDepositBigNumber)) {
    console.log(
      "Insufficient allowance. Submitting an allowance for the LockingVault before depositing the tokens...",
    );
    const approvalTx = await votingToken.approve(
      vaultAddress,
      amountToDepositBigNumber,
    );
    await approvalTx.wait(1);
    console.log(`Approval confirmed! ${approvalTx.hash}`);
  }

  const depositTx = await vaultContract.deposit(
    signer.address,
    amountToDepositBigNumber,
    // set first delegation to self, this will no-op if the signer is already
    // delegated
    signer.address,
  );
  console.log("Deposit submitted, waiting 1 confirmation...");
  const minedTx = depositTx.wait(1);

  console.log(`Deposit confirmed! ${depositTx.hash}`);
  return minedTx;
}

promptChooseLockingVaultAndDepositTokens()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
