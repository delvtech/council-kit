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
const lockingVaultProxyAddress = goerliContracts.find(
  ({ name }) => name === "LockingVaultProxy",
)?.address as string;
const vestingVaultProxyAddress = goerliContracts.find(
  ({ name }) => name === "VestingVaultProxy",
)?.address as string;
const gscVotingAddress = goerliContracts.find(
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
    name: "Core Voting",
    address: goerliCoreVotingAddress,
    abi: {},
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: lockingVaultProxyAddress,
        type: "LockingVault",
        abi: {},
        descriptionURL: "https://moreinfo.com",
      },
      {
        name: "Vesting Vault",
        address: vestingVaultProxyAddress,
        type: "VestingVault",
        abi: {},
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {
      0: {
        sentenceSummary:
          "The GSC should have 1 second to decide whether to intervene on a proposal before it can be finalized on-chain.",
        paragraphSummary:
          "This will set the waitTime for Timelock execution to 1 second. This will give GSC members little to no time to react to malicious proposals that pass a core vote. At the same time, proposals that would seek to change the structure or other properties of the GSC could become difficult to pass due to GSC intervention.",
        descriptionURL: "https://moreinfo.com",
        targets: [],
        calldatas: [],
      },
      1: {
        sentenceSummary:
          "Vesting Vault participants should not be allowed to vote on core proposals.",
        paragraphSummary:
          "It is not enough for the vesting vault to have an unvestedMultiplier applied to the voting power it holds. The vault itself should not be approved for voting on core proposals at all. This will help balance incentives, where vesting participants might try to alter the vesting agreement themselves through a core vote.",
        descriptionURL: "https://moreinfo.com",
        targets: [],
        calldatas: [],
      },
    },
  },

  gscVoting: {
    name: "GSC",
    address: gscVotingAddress,
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
