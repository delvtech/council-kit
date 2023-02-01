import { goerliDeployments } from "@council/deploy";
import { CouncilConfig } from "src/config/CouncilConfig";

const { contracts: goerliContracts } =
  goerliDeployments[goerliDeployments.length - 1];

// Find the deployed contract addresses. These are safe to cast as strings
// because we know the deployment contains these contracts in the
// @council/deploy project.
const goerliTimelockAddress = goerliContracts.find(
  ({ name }) => name === "Timelock",
)?.address as string;
const goerliCoreVotingAddress = goerliContracts.find(
  ({ name }) => name === "CoreVoting",
)?.address as string;
// Using the proxy address for the Locking vault
const goerliLockingVaultAddress = goerliContracts.find(
  ({ name }) => name === "LockingVaultProxy",
)?.address as string;
const goerliVestingVaultAddress = goerliContracts.find(
  ({ name }) => name === "VestingVaultProxy",
)?.address as string;
const goerliGSCVotingAddress = goerliContracts.find(
  ({ name }) => name === "GSCCoreVoting",
)?.address as string;
const goerliGSCVaultAddress = goerliContracts.find(
  ({ name }) => name === "GSCVault",
)?.address as string;

export const goerliCouncilConfig: CouncilConfig = {
  version: "",
  chainId: 5,
  timelock: {
    address: goerliTimelockAddress,
    abi: {},
  },
  coreVoting: {
    address: goerliCoreVotingAddress,
    abi: {},
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: goerliLockingVaultAddress,
        type: "LockingVault",
        abi: {},
        descriptionURL: "https://moreinfo.com",
      },
      {
        name: "Vesting Vault",
        address: goerliVestingVaultAddress,
        type: "VestingVault",
        abi: {},
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {
      0: {
        descriptionURL: "https://moreinfo.com",
        targets: [],
        calldatas: [],
      },
      1: {
        descriptionURL: "https://moreinfo.com",
        targets: [],
        calldatas: [],
      },
    },
  },

  gscVoting: {
    address: goerliGSCVotingAddress,
    abi: {},
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "GSC Vault",
        address: goerliGSCVaultAddress,
        type: "GSCVault",
        abi: {},
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {
      0: { descriptionURL: "", targets: [], calldatas: [] },
      1: { descriptionURL: "", targets: [], calldatas: [] },
    },
  },
};
