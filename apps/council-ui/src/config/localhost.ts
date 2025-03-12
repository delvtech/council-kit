import { CouncilConfig } from "src/config/types";

const wallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

export const localhostCouncilConfig = {
  version: "",
  chainId: 31337,
  coreVoting: {
    name: "Core Voting",
    address: "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: "0x8a791620dd6260079bf849dc5567adc3f2fdc318",
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {},
  },
} as const satisfies CouncilConfig;

// 0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0
// 0x0dcd1bf9a1b36ce34237eeafef220932846bcd82
// 0x341a7b42000000000000000000000000610178da211fef7d417bc0e6fed39f05609ad7880000000000000000000000000000000000000000000000000000000000000001
