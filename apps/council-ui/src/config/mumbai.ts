import { mumbaiDeployments } from "@council/deploy";
import { utils } from "ethers";
import { CouncilConfig } from "src/config/CouncilConfig";

import ProxyAdminJson from "src/artifacts/ProxyAdmin.json";

const proxyAdminAddress = "0x198A191CB42573F46be162b53F1bA16230ca2eB4";
const specTokenProxy = "0x8BEAe9284e6FC83076B8931F1c27eDc657b34c3A";
const specTokenV2Impl = "0xA95489C36630EE65000B1A4dC82f1F04eA1dF33C";
const specTokenV3Impl = "0xEd4E5654C0e9e708980d276801EEd703640055a6";

const proxyAdminInterface = new utils.Interface(ProxyAdminJson.abi);

const calldatas0 = [
  proxyAdminInterface.encodeFunctionData("upgrade", [
    specTokenProxy, // SpecTokenProxy
    specTokenV2Impl, // SpecTokenV2Impl
  ]),
];

const calldatas1 = [
  proxyAdminInterface.encodeFunctionData("upgrade", [
    specTokenProxy, // SpecTokenProxy
    specTokenV3Impl, // SpecTokenV3Impl
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
        calldatas: calldatas0,
      },
      1: {
        sentenceSummary:
          "The SpecTokenV2 contract should be upgraded to SpecTokenV3 in order to see versioning change",
        paragraphSummary:
          "This will change the SPEC_TOKEN_REVISION version in the contract from 0x2 to 0x3",
        title: "SPECGRU-2: SpecTokenV2 to SpecTokenV3 upgrade.",
        descriptionURL: "https://moreinfo.com",
        targets: [proxyAdminAddress],
        calldatas: calldatas1,
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
