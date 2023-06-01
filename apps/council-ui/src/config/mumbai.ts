import { mumbaiDeployments } from "@council/deploy";
import { utils } from "ethers";
import { CouncilConfig } from "src/config/CouncilConfig";

import ProxyAdminJson from "src/artifacts/ProxyAdmin.json";

const proxyAdminAddress = "0x2f687f3fFd7e045365473F8655b560d2C856516c";
const specTokenProxy = "0x5e1b640893a4BDA27EE4F1bA8a1b439F190254db";
const specTokenV2Impl = "0x59474fD0A24157712d03EdCaa61ABAe5a09bd895";

const proxyAdminInterface = new utils.Interface(ProxyAdminJson.abi);

const calldatas = [
  proxyAdminInterface.encodeFunctionData("upgrade", [
    specTokenProxy, // SpecTokenProxy
    specTokenV2Impl, // SpecTokenV2Impl
  ]),
];

const { contracts: mumbaiContracts } =
  mumbaiDeployments[mumbaiDeployments.length - 1];

// Find the deployed contract addresses. These are safe to cast as strings
// because we know the deployment contains these contracts in the
// @council/deploy project.
const mumbaiTimelockAddress = mumbaiContracts.find(
  ({ name }) => name === "Timelock",
)?.address as string;
const mumbaiCoreVotingAddress = mumbaiContracts.find(
  ({ name }) => name === "CoreVoting",
)?.address as string;
const lockingVaultProxyAddress = mumbaiContracts.find(
  ({ name }) => name === "LockingVaultProxy",
)?.address as string;
const vestingVaultProxyAddress = mumbaiContracts.find(
  ({ name }) => name === "VestingVaultProxy",
)?.address as string;
const gscVotingAddress = mumbaiContracts.find(
  ({ name }) => name === "GSCCoreVoting",
)?.address as string;
const mumbaiGSCVaultAddress = mumbaiContracts.find(
  ({ name }) => name === "GSCVault",
)?.address as string;

export const mumbaiCouncilConfig: CouncilConfig = {
  version: "",
  chainId: 80001,
  timelock: {
    address: mumbaiTimelockAddress,
  },
  coreVoting: {
    name: "Core Voting",
    address: mumbaiCoreVotingAddress,
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: lockingVaultProxyAddress,
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
      {
        name: "Vesting Vault",
        address: vestingVaultProxyAddress,
        type: "VestingVault",
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {
      0: {
        sentenceSummary:
          "The SpecTokenV1 contract should be upgraded to SpecTokenV2 in order to support unrestricted transfers.",
        paragraphSummary:
          "This will remove the whitelisted functionality from the Spec Token contract, and will allow unrestricted transfers to and from anyone.",
        title:
          "SPECGRU-1: SpecTokenV1 to SpecTokenV2 upgrade. Enables token transferability.",
        descriptionURL: "https://moreinfo.com",
        targets: [proxyAdminAddress],
        calldatas: calldatas,
      },
    },
  },
  gscVoting: {
    name: "GSC",
    address: gscVotingAddress,
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "GSC Vault",
        address: mumbaiGSCVaultAddress,
        type: "GSCVault",
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {
      0: { descriptionURL: "", targets: [], calldatas: [] },
      1: { descriptionURL: "", targets: [], calldatas: [] },
    },
  },
};
