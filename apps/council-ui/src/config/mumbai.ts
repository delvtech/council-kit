//import { mumbaiDeployments } from "@council/deploy";
import { utils } from "ethers";
import { CouncilConfig } from "src/config/CouncilConfig";

import ProxyAdminJson from "src/artifacts/ProxyAdmin.json";

const proxyAdminAddress = "0x91e1156d5Fba6b1B251f396e96aFAaCE91394283";

const proxyAdminInterface = new utils.Interface(ProxyAdminJson.abi);

const calldatas = [
  proxyAdminInterface.encodeFunctionData("upgrade", [
    "0xF0CEC3F6a38D8FBE072d5E8efF9B546C70E42cDd", // SpecTokenProxy
    "0xDD275C92A0bBacb6FBeca27ffa2D646fe1d07816", // SpecTokenV2Impl
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
    address: "0xa4B16B1676EcA1E888f5dbF5Bac627f5ef6B71Dd",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        address: "0xd10C17DA353D7B906BF04A84875117603d681288",
        type: "LockingVault",
        descriptionURL: "https://moreinfo.com",
      },
      {
        name: "Vesting Vault",
        address: "0x91884f0c2EdBD69A04372b740a916295281D61d3",
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
    address: "0x780c0b5C6c8bD12f17B862cB2ECCeFD982B625Df",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "GSC Vault",
        address: "0x5CC5134434C09bA1F4dbE6E2f101591586E8C97f",
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
