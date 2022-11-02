import { CouncilConfig } from "src/config/CouncilConfig";

/**
 * Gets the contract and proposal information for the chain id in environment
 * variables.
 *
 * NOTE: This returns a Promise so it remains flexible in cases where the
 * information is fetched from an external source.
 */
async function getCouncilConfig(): Promise<CouncilConfig> {
  switch (process.env.NEXT_PUBLIC_CHAIN_ID) {
    case "1": // mainnet
      return getMainnetCouncilConfig();
    case "5": // goerli
      return getGoerliCouncilConfig();
    default:
      console.error(
        `Config not found for chain: ${process.env.NEXT_PUBLIC_CHAIN_ID}, falling back to mainnet.`,
      );
      return getMainnetCouncilConfig();
  }
}

export default getCouncilConfig();

async function getMainnetCouncilConfig(): Promise<CouncilConfig> {
  return {
    version: "",
    chainId: 1,
    timelock: {
      address: "0x81758f3361A769016eae4844072FA6d7f828a651",
      abi: {},
    },
    coreVoting: {
      address: "0xEaCD577C3F6c44C3ffA398baaD97aE12CDCFed4a",
      abi: {},
      descriptionURL: "https://moreinfo.com",
      vaults: [
        {
          name: "CoreVotingLockingVault",
          address: "0x02Bd4A3b1b95b01F2Aa61655415A5d3EAAcaafdD",
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

async function getGoerliCouncilConfig(): Promise<CouncilConfig> {
  return {
    version: "",
    chainId: 5,
    timelock: {
      address: "0x36687bdD319a78AB4b4347f3A7459Da235AFc4f4",
      abi: {},
    },
    coreVoting: {
      address: "0x0CB8aa45068EE31e97B717b0B35e26A43884c84c",
      abi: {},
      descriptionURL: "https://moreinfo.com",
      vaults: [
        {
          name: "CoreVotingLockingVault",
          address: "0xb5E8AF575Ee302A24c6C7746a99D895BeF67cb5D",
          type: "LockingVault",
          abi: {},
          descriptionURL: "https://moreinfo.com",
        },
        {
          name: "VestingVault",
          address: "0xe69D2F8DeD2924e0845118E7E467Fc97F7994ef6",
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
      address: "0x600c4926c9F88beCE3533ceaAA36804d6E23F1c1",
      abi: {},
      descriptionURL: "https://moreinfo.com",
      vaults: [
        {
          name: "GSCVault",
          address: "0x600c4926c9F88beCE3533ceaAA36804d6E23F1c1",
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
