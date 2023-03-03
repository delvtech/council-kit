import { goerliDeployments } from "@council/deploy";
import mainnetAddressList from "src/addresses/ElementMainnetAddressList.json";
import { provider } from "src/provider";

const { contracts: goerliContracts } =
  goerliDeployments[goerliDeployments.length - 1];

// Find the deployed contract addresses. These are safe to cast as strings
// because we know the deployment contains these contracts in the
// @council/deploy project.
const goerliAddresses = {
  timeLock: goerliContracts.find(({ name }) => name === "Timelock")
    ?.address as string,
  coreVoting: goerliContracts.find(({ name }) => name === "CoreVoting")
    ?.address as string,
  lockingVault: goerliContracts.find(({ name }) => name === "LockingVaultProxy")
    ?.address as string,
  vestingVault: goerliContracts.find(({ name }) => name === "VestingVaultProxy")
    ?.address as string,
  gscCoreVoting: goerliContracts.find(({ name }) => name === "GSCCoreVoting")
    ?.address as string,
  gscVault: goerliContracts.find(({ name }) => name === "GSCVault")
    ?.address as string,
};

type Addresses = typeof mainnetAddressList.addresses | typeof goerliAddresses;

export async function getElementAddress(): Promise<Addresses> {
  const { chainId } = await provider.getNetwork();
  return chainId === 5 ? goerliAddresses : mainnetAddressList.addresses;
}
