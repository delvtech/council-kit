import { CouncilConfig } from "src/config/CouncilConfig";


export const goerliCouncilConfig: CouncilConfig = {
  version: "",
  chainId: 5,
  timelock: {
    address: "0x818E1AC09DC9D026211fF21263599BCEBC4DeB91",
  },
  coreVoting: {
    name: "Core Voting",
    address: "0x25EFa0d768Dc9BDaAF937903EC74A44A69Bc896F",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: "0x7B424CECfD3d7972cf7c0Cbffec7d990E91F4F80",
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
      {
        name: "Vesting Vault",
        address: "0xa8b5f16500757baC1921eb1d3AdacfA2C56104Ca",
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
    address: "0xE27eF7033580b545530D28Ba739E5f651a5Be37A",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "GSC Vault",
        address: "0xeA59876eC9db53d63f97B650c0f566E8b5D45144",
        type: "GSCVault",
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {
      0: { descriptionURL: "", targets: [], calldatas: [] },
      1: { descriptionURL: "", targets: [], calldatas: [] },
    },
  },

  /**
   * Optional Push integration
   */
  push: {
    channel: "0xbAE1338219a9BDDB38d38B77094e833995B703E2",
    env: "staging",
  },
};
