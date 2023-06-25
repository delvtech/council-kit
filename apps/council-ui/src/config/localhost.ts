import { CouncilConfig } from "src/config/CouncilConfig";

export const localhostCouncilConfig: CouncilConfig = {
  version: "",
  chainId: 31337,
  timelock: {
    address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  },
  coreVoting: {
    name: "Core Voting",
    address: "0x0165878a594ca255338adfa4d48449f69242eb8f",
    // address: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6",
        // address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {
      0: {
        descriptionURL: "https://moreinfo.com",
        title: "EGP-2: Increase GSC quorum threshold",
        sentenceSummary: "Increase the current GSC quroum threshold to 3.",
        paragraphSummary:
          "As of today (April 28, 2022) there has only been one delegate (myself) who has proven their membership to the GSC on-chain. In roughly five days I will be able to pass votes by myself with no further approval because the current quroum threshold on the GSC is one. I believe that no one person should be able to govern the GSC by themselves, and thus I am proposing to effectively lock the GSC until two other delegates join the GSC. Three was chosen as a starting point for one reason, to break a tie. As more delegates join, I'm sure this value will gradually increase but for the time being, a threshold of three will be adequate to ensure some level of participation.",
      },
    },
  },
};
