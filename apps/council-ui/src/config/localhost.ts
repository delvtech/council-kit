import { CouncilConfig } from "src/config/CouncilConfig";

export const localhostCouncilConfig: CouncilConfig = {
  version: "",
  chainId: 1337,
  timelock: {
    address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  },
  coreVoting: {
    name: "Core Voting",
    address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
      {
        name: "Locking Vault 2",
        address: "0x959922be3caee4b8cd9a407cc3ac1c251c2007b1",
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
      {
        name: "Vesting Vault",
        address: "0x59b670e9fa9d0a427751af201d676719a970857b",
        type: "VestingVault",
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {},
  },

  airdrop: {
    address: "0x0165878a594ca255338adfa4d48449f69242eb8f",
    baseDataURL: "/api/airdrop",
  },
};
