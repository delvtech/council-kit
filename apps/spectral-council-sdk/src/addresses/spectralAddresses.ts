import { mumbaiDeployments } from "@council/deploy";

const { contracts: mumbaiContracts } =
  mumbaiDeployments[mumbaiDeployments.length - 1];

// Find the deployed contract addresses. These are safe to cast as strings
// because we know the deployment contains these contracts in the
// @council/deploy project.
const mumbaiAddresses = {
  timeLock: mumbaiContracts.find(({ name }) => name === "Timelock")
    ?.address as string,
  coreVoting: mumbaiContracts.find(({ name }) => name === "CoreVoting")
    ?.address as string,
  lockingVault: mumbaiContracts.find(({ name }) => name === "LockingVaultProxy")
    ?.address as string,
  vestingVault: mumbaiContracts.find(({ name }) => name === "VestingVaultProxy")
    ?.address as string,
  gscCoreVoting: mumbaiContracts.find(({ name }) => name === "GSCCoreVoting")
    ?.address as string,
  gscVault: mumbaiContracts.find(({ name }) => name === "GSCVault")
    ?.address as string,
};

type Addresses = typeof mumbaiAddresses;

export async function getSpectralAddress(): Promise<Addresses> {
  return mumbaiAddresses;
}
