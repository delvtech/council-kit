import { CouncilConfig } from "src/config/CouncilConfig";

export const localhostCouncilConfig: CouncilConfig = {
  version: "",
  chainId: 31337,
  timelock: {
    address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  },
  coreVoting: {
    name: "Core Voting",
    address: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {},
  },
};
