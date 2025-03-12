import { CouncilConfig } from "src/config/types";

export const mainnetCouncilConfig = {
  version: "",
  chainId: 1,
  coreVoting: {
    name: "Core Voting",
    address: "0xdf66ab853fc112ec955531bd76e9079db30a0e27",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault 2",
        address: "0x7c4bda48bd4c9ac4fbcc60deeb66bf80d35705f0",
        type: "LockingVault",
        descriptionURL: "",
      },
      {
        name: "Locking Vault 1",
        address: "0xdb259fa7d7f9f68ae3ffc3c748516ba9567a7576",
        type: "LockingVault",
        descriptionURL: "",
      },
    ],
    proposals: {},
  },
} as const satisfies CouncilConfig;

// 0x1e53bea57dd5dda7bff1a1180a2f64a5c9e222f5
// 0x27f7785b17c6b4d034094a1b16bc928bd697f386
// 0x341a7b4200000000000000000000000027f7785b17c6b4d034094a1b16bc928bd697f3860000000000000000000000000000000000000000000000000000000000000001
