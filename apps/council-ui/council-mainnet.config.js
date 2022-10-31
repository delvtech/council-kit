export default async function config() {
  return {
    version: "",
    chainId: 1,
    timelock: {
      address: "",
      abi: {},
    },
    coreVoting: {
      address: "",
      abi: {},
      descriptionURL: "https://moreinfo.com",
      vaults: [
        {
          name: "CoreVotingLockingVault",
          address: "0xCoreVotingLockingVault",
          type: "LockingVault",
          abi: {},
          descriptionURL: "https://moreinfo.com",
        },
        {
          name: "VestingVault",
          address: "0xVestingVault",
          type: "LockingVault",
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
      address: "",
      abi: {},
      descriptionURL: "https://moreinfo.com",
      vaults: [
        {
          name: "GSCVault",
          address: "0xGSCVault",
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
}
