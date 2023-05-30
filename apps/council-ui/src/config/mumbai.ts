//import { mumbaiDeployments } from "@council/deploy";
import { utils } from "ethers";
import { CouncilConfig } from "src/config/CouncilConfig";

import ProxyAdminJson from "src/artifacts/ProxyAdmin.json";

const proxyAdminAddress = "0x91e1156d5Fba6b1B251f396e96aFAaCE91394283";

const proxyAdminInterface = new utils.Interface(ProxyAdminJson.abi);

const calldatas = [
  proxyAdminInterface.encodeFunctionData("upgrade", [
    "0x39421BE6bfdcDeaF01854F33Cf9C3B33d04BA221", // SpecTokenProxy
    "0xAbd78b1C016286F45d8152889cF788EEDf1B0409", // SpecTokenV2Impl
  ]),
];

export const mumbaiCouncilConfig: CouncilConfig = {
  version: "",
  chainId: 80001,
  timelock: {
    address: "0xBdd3A047Fd69e9021d5535Ae522Dfc929045de2e",
  },
  coreVoting: {
    name: "Core Voting",
    address: "0xF0e4d38516a4Acc207E64d73d60D635AF35d1c21",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: "0x4032bbb913Bc278730Bdf52F2Bf442381580f54F",
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
      {
        name: "Vesting Vault",
        address: "0xf20a0d8e2a8c9D52f1b74d6a4987c227c2b98d0E",
        type: "VestingVault",
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {
      0: {
        sentenceSummary:
          "The SpecToken contract should be upgraded to support unrestricted transfers.",
        paragraphSummary:
          "This will remove the whitelisted functionality from the Spec Token contract, and will allow unrestricted transfers to and from anyone.",
        descriptionURL: "https://moreinfo.com",
        targets: [proxyAdminAddress],
        calldatas: calldatas,
      },
    },
  },

  gscVoting: {
    name: "GSC",
    address: "0x2e260C9f357AAa7cEE436C243F125b8dF7fC5764",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "GSC Vault",
        address: "0x644f1aAc68bfe53099A401Cf09C1f354a991cD2F",
        type: "GSCVault",
        descriptionURL: "https://moreinfo.com",
      },
    ],
    proposals: {
      0: { descriptionURL: "", targets: [], calldatas: [] },
      1: { descriptionURL: "", targets: [], calldatas: [] },
    },
  },
};
