import { CouncilConfig } from "src/config/CouncilConfig";

/**
 * Gets the contract and proposal information for a given chain id.
 *
 * NOTE: This returns a Promise so it remains flexible in cases where the
 * information is fetched from an external source.
 *
 * @param chainId - The chain id to get the config for
 * @returns Promise<CouncilConfig>
 */
async function getCouncilConfig(): Promise<CouncilConfig> {
  switch (process.env.NEXT_PUBLIC_CHAIN_ID) {
    case "1": // mainnet
      return getMainnetCouncilConfig();
    default:
      console.error(
        `Config not found for chain: ${process.env.NEXT_PUBLIC_CHAIN_ID}, falling back to mainnet.`,
      );
      return getMainnetCouncilConfig();
  }
}

export default getCouncilConfig();

/**
 *
 * @returns Promise<CouncilConfig>
 */
async function getMainnetCouncilConfig(): Promise<CouncilConfig> {
  return {
    version: "",
    chainId: 1,
    timelock: {
      address: "",
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
