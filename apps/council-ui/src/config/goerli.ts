import { CouncilConfig } from "src/config/CouncilConfig";

export const goerliCouncilConfig: CouncilConfig = {
  version: "",
  chainId: 5,
  timelock: {
    address: "0x7e7eEc56D2C53E9203d5cF48E01560Da52ff5214",
  },
  coreVoting: {
    name: "Core Voting",
    address: "0x1dcFAD45c31e0b4d9A3E3cb05013023d9A9Bbd11",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: "0x4520da1DDFad1F48536A2a21CF5923dd2c2247e9",
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
      {
        name: "Vesting Vault",
        address: "0x6dbE1aF34649d1efe5f6a708A1CF93bF2F422250",
        type: "VestingVault",
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
    address: "0xd3f84fc6f50e421502e9f8e36b519E0D156BE6C8",
    descriptionURL: "https://moreinfo.com",
    vault: {
      name: "GSC Vault",
      address: "0xCFb73f8D5D29e5d936AdF86A8A739AE12b882E8D",
      type: "GSCVault",
      descriptionURL: "https://moreinfo.com",
    },
    proposals: {
      0: { descriptionURL: "", targets: [], calldatas: [] },
      1: { descriptionURL: "", targets: [], calldatas: [] },
    },
  },

  airdrop: {
    address: "0x8278a7951f9E3C88B1817223603635981D65bC63",
    baseDataURL: "/api/airdrop",
  },

  /**
   * Optional Push integration
   */
  push: {
    channel: "0xbAE1338219a9BDDB38d38B77094e833995B703E2",
    env: "staging",
  },
};
