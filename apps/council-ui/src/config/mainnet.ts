import { CouncilConfig } from "src/config/CouncilConfig";

export const mainnetCouncilConfig: CouncilConfig = {
  version: "",
  chainId: 1,
  timelock: {
    address: "0x81758f3361A769016eae4844072FA6d7f828a651",
  },
  coreVoting: {
    name: "Core Voting",
    address: "0xEaCD577C3F6c44C3ffA398baaD97aE12CDCFed4a",
    descriptionURL: "https://moreinfo.com",
    vaults: [
      {
        name: "Locking Vault",
        sentenceSummary:
          "Deposit tokens in exchange for voting power, which can then be delegated.",
        paragraphSummary:
          "Allows users to deposit their tokens in exchange for voting power, which can also be delegated to a different user.",
        address: "0x02Bd4A3b1b95b01F2Aa61655415A5d3EAAcaafdD",
        type: "LockingVault",
        descriptionURL:
          "https://docs-delv.gitbook.io/element-developer-docs/governance-council/council-protocol-smart-contracts/voting-vaults/locking-vault",
      },
      {
        name: "Vesting Vault",
        address: "0x6De73946eab234F1EE61256F10067D713aF0e37A",
        sentenceSummary:
          "Allows vesting tokens to have voting power in proportion to a DAO-defined multiplier.",
        paragraphSummary:
          "Allows locked / vesting positions to still have voting power in the governance system by using a defined multiplier for the vested tokens over unvested.",
        type: "VestingVault",
        descriptionURL:
          "https://docs-delv.gitbook.io/element-developer-docs/governance-council/council-protocol-smart-contracts/voting-vaults/vesting-vault",
      },
    ],
    proposals: {
      0: {
        descriptionURL: "",
        targets: [],
        calldatas: [],
      },
      1: {
        descriptionURL:
          "https://snapshot.org/#/elfi.eth/proposal/0x46785a4b78a9d03aeb5cdeb1c3ca4ae02cf9e5aca508e59bef405d16a7c8b4a6",
        targets: [],
        calldatas: [],
        title: "EGP-2: Increase GSC quorum threshold",
        sentenceSummary: "Increase the current GSC quroum threshold to 3.",
        paragraphSummary:
          "As of today (April 28, 2022) there has only been one delegate (myself) who has proven their membership to the GSC on-chain. In roughly five days I will be able to pass votes by myself with no further approval because the current quroum threshold on the GSC is one. I believe that no one person should be able to govern the GSC by themselves, and thus I am proposing to effectively lock the GSC until two other delegates join the GSC. Three was chosen as a starting point for one reason, to break a tie. As more delegates join, I'm sure this value will gradually increase but for the time being, a threshold of three will be adequate to ensure some level of participation.",
      },
      2: {
        descriptionURL:
          "https://snapshot.org/#/elfi.eth/proposal/0x132d4d3e0580349d938d22c844ce088ba2e5f394fc28b41f2927856746b125d7",
        targets: [],
        calldatas: [],
        title: "(Invalid) EGP-15: Element Fixed Borrow Protocol Grant Proposal",
        sentenceSummary:
          "Component is proposing a 274,414.06 ELFI voting token grant to build a fixed borrow protocol on top of Element Finance and for building the YTC tool.",
        paragraphSummary:
          "The proceeds of this grant will enable us to build a protocol offering competitive, low-cost, fixed-rate borrowing on Compound Finance and Aave. Component has been an active contributor to Element Finance since early 2021 and will continue to launch new integrations for fixed rates on Element Finance. This grant ensures a long term relationship where Component will be part of growing, generating revenue and decentralizing the Element DAO.",
      },
      3: {
        descriptionURL:
          "https://snapshot.org/#/elfi.eth/proposal/0x132d4d3e0580349d938d22c844ce088ba2e5f394fc28b41f2927856746b125d7",
        targets: [],
        calldatas: [],
        title: "EGP-15: Element Fixed Borrow Protocol Grant Proposal",
        sentenceSummary:
          "Component is proposing a 274,414.06 ELFI voting token grant to build a fixed borrow protocol on top of Element Finance and for building the YTC tool.",
        paragraphSummary:
          "The proceeds of this grant will enable us to build a protocol offering competitive, low-cost, fixed-rate borrowing on Compound Finance and Aave. Component has been an active contributor to Element Finance since early 2021 and will continue to launch new integrations for fixed rates on Element Finance. This grant ensures a long term relationship where Component will be part of growing, generating revenue and decentralizing the Element DAO.",
      },
      4: {
        descriptionURL:
          "https://snapshot.org/#/elfi.eth/proposal/0xcedbf99283b0dc2c32184cc04a66839ff483621ee661da75a421931297ac7788",
        targets: [],
        calldatas: [],
        title:
          "EGP-22: Removal of Non-Contributor Grants from the Vesting Vault",
        sentenceSummary:
          "Removing the Element Finance team-allocated token grants for those who left Element Finance before their vesting cliffs, for team members who partially vested, or for team members who left before the vesting dates were reached.",
        paragraphSummary:
          "This proposal formalizes a solution for the removal/reclaiming of Element Finance team members-allocated token grants who departed prior to reaching the vesting vault smart contract-defined vesting cliffs, partially vested, and/or before the vesting dates were reached.",
      },
      5: {
        descriptionURL:
          "https://snapshot.org/#/elfi.eth/proposal/0x7c35f280e01513b65fe0a3f2abdf2d8cd28eb019c14ad732b1cf25386a52a451",
        targets: [],
        calldatas: [],
        title:
          "EGP-23: Convert timestamps to blocknumbers in Deployed Vesting Vault",
        sentenceSummary:
          "Fix an identified bug within the deployed Vesting Vault Contract regarding the token grant configurations for core contributors, advisors, and investors.",
        paragraphSummary:
          "It was identified that the grants in the Vesting vault contract were misconfigured during deployment last March 31, 2022. The time in which the grants will start vesting was set up using Unix time stamps in seconds instead of block numbers. The contract expects block numbers as the threshold when funds will start dispersing. The difference between block numbers and time stamps is on an order of magnitude. This has caused all grants to not start until the year ~2630.",
      },
      6: {
        descriptionURL:
          "https://snapshot.org/#/elfi.eth/proposal/0x0bebfeaada03ab21c52917ff5f0347fa29ce7a45a0a55a48b5382bf02963331f",
        targets: [],
        calldatas: [],
        title:
          "EGP-24: Reclaim (Clawback) unclaimed voting rights that have been distributed",
        sentenceSummary:
          "Reclaim the unclaimed voting rights (ELFI) from the initial distribution event and direct it back to the DAO Treasury.",
        paragraphSummary:
          "On March 31st, 2022 the Element Labs team distributed voting rights to various different parties, users, and individuals deemed qualified to participate in the DAO operations and voting of the newly formed Element DAO. Close to a year later, a decent % of the distributed voting rights have still not been claimed and utilized as intended. This proposal is to suggest that the unclaimed voting rights ought to be reclaimed by the Element DAO to be re-distributed into the right hands via grants, participants, DAO contributors, liquidity programs, rewards, bounties, etc.",
      },
      7: {
        descriptionURL:
          "https://snapshot.org/#/elfi.eth/proposal/0xea38eff160c02bd3bce89830ac1e866dc6f5e47ac36f9ede504f30a5661a5c21",
        targets: [],
        calldatas: [],
        title: "EGP-21: Enable the transferability of ELFI",
        sentenceSummary:
          "Enable the transferability of ELFI by unlocking the voting vaults where the delegated ELFI tokens are currently locked in.",
        paragraphSummary:
          "This EGP is focused on enabling the transferability of ELFI to allow for the changing of hands of voters. It has been close to 1 year since the release of ELFI, and sufficient (necessary) progress has been made in the development of the DAO. Now is the time for all of the participants within the DAO and the users outside of the DAO looking in to be given the ability to freely choose how they want to express their form of participation.",
      },
      8: {
        descriptionURL:
          "https://snapshot.org/#/elfi.eth/proposal/0x38b141145f27e23753978ebe8987059c49986579d1b7dcbe1a6d6f8743bff8f7",
        targets: [],
        calldatas: [],
        title:
          "EGP-5: Enable Temporary Protocol Incentives for Liquidity Providers",
        sentenceSummary:
          "Enable protocol incentives to keep TVL in the protocol, and increase network distribution to more users prior to ELFI unlock.",
        paragraphSummary:
          "Discussing a fair short term incentive program before enabling transferability of ELFI. As Element’s vaults begin to expire, the necessity of incentivizing rollover is getting more and more important to help retain liquidity in the protocol. The fixed income markets require liquidity to create the opportunity for fixed rate purchasers to earn a fixed rate with minimal slippage.",
      },
      9: {
        descriptionURL:
          "https://snapshot.org/#/elfi.eth/proposal/0x38b141145f27e23753978ebe8987059c49986579d1b7dcbe1a6d6f8743bff8f7",
        targets: [],
        calldatas: [],
        title: "Technical Correction of Core Voting Proposal 8 (EGP-5)",
        sentenceSummary:
          "This proposal fixes the technical error of the prior proposal, EGP-5.",
        paragraphSummary:
          "This proposal fixes the technical error of the prior proposal, EGP-5. The ELFI token has 18 decimals, which was not accounted for in Proposal 8. Thus, despite the success of the onchain vote, the retroactive incentives of EGP-5 could not be sent to the reward contract.",
      },
      10: {
        descriptionURL:
          "https://docs.google.com/document/d/1tutU6ZzIvOCv3CcdCzUJ_PbPMIUM-xu3gAhQ0qkV1Z0/edit",
        targets: [],
        calldatas: [],
        title: "EGP16-2: Begin unwinding of the main treasury",
        sentenceSummary:
          "This PR is the follow-up from the approved Snapshot proposal, targeting the unwinding of the main treasury.",
        paragraphSummary:
          "The main treasury  holds approx. 192,000 USDC in assets wound up in Yearn positions. These assets come from affiliate fees via Yearn. A separate proposal manages the unwinding of the GSC treasury, which contains about 60,000 USDC. Following this proposal, two more will be necessary to unwind CRV positions and to consolidate assets into USDC, DAI, and ETH.",
      },
      11: {
        targets: [],
        calldatas: [],
        title:
          "EGP28: Security Fix for Discovered Vulnerability in the Locking Vault",
        sentenceSummary:
          "EGP-28 is being proposed in response to a bug disclosure from the Immunefi bug bounty program related to the LockingVault.",
        paragraphSummary:
          "This proposal includes a solution to fix the ability for exploit to the LockingVault. For security purposes, this proposal won’t include the specific details of the proposal solution until the fix has been implemented. Once the proposal has been executed, a full report will be published revealing the bug report, the fix (including the technical solution), and a call to action for governance process improvement in the case that another situation like this occurs in the future.",
      },
      12: {
        targets: [],
        calldatas: [],
        title:
          "EGP27: The Removal of Non-Contributor Grants from the Vesting Vault",
        sentenceSummary:
          "EGP-27 is being proposed to remove the DELV (formerly Element Finance) team-allocated token grants for those who left DELV before their vesting cliffs, reduce existing grants for Team Members who partially vested, or for Team Members who left before the vesting dates were reached.",
        paragraphSummary:
          "This proposal formalizes a solution for the removal/reclaiming of DELV Team Members-allocated token grants who departed prior to reaching the vesting vault smart contract-defined vesting cliffs, partially vested, and/or before the vesting dates were reached.\n\n These DELV team-allocated token grants were distributed during the governance launch of Element DAO on March 31 of 2022. The vesting cliff was defined as one year from the launch date and the token vesting schedule defined was as three years after the launch date.",
      },
      13: {
        targets: [],
        calldatas: [],
        title: "EGP-16: Main Treasury - 1",
        sentenceSummary: "Revised proposal to unwind the main treasury.",
        paragraphSummary:
          "The main treasury  holds approx. 192,000 USDC in assets wound up in Yearn positions. These assets come from affiliate fees via Yearn. A separate proposal manages the unwinding of the GSC treasury, which contains about 60,000 USDC. Following this proposal, two more will be necessary to unwind CRV positions and to consolidate assets into USDC, DAI, and ETH.",
      },
      14: {
        targets: [],
        calldatas: [],
        title: "EGP-16: Main Treasury - 2",
        sentenceSummary: "Revised proposal to unwind the main treasury.",
        paragraphSummary:
          "The main treasury  holds approx. 192,000 USDC in assets wound up in Yearn positions. These assets come from affiliate fees via Yearn. A separate proposal manages the unwinding of the GSC treasury, which contains about 60,000 USDC. Following this proposal, two more will be necessary to unwind CRV positions and to consolidate assets into USDC, DAI, and ETH.",
      },
      15: {
        targets: [],
        calldatas: [],
        title: "EGP-16: Main Treasury - 3",
        sentenceSummary: "Revised proposal to unwind the main treasury.",
        paragraphSummary:
          "The main treasury  holds approx. 192,000 USDC in assets wound up in Yearn positions. These assets come from affiliate fees via Yearn. A separate proposal manages the unwinding of the GSC treasury, which contains about 60,000 USDC. Following this proposal, two more will be necessary to unwind CRV positions and to consolidate assets into USDC, DAI, and ETH.",
      },
      16: {
        targets: [],
        calldatas: [],
        title:
          "EGP-29: Hyperdrive Public Testnet Implementation for Element DAO",
        sentenceSummary:
          "DELV is creating this governance proposal to deploy a Hyperdrive Public Testnet Implementation for Element DAO on the Sepolia Ethereum Testnet.",
        paragraphSummary:
          "This proposal includes the details for deploying the Public Testnet Implementation to Sepolia Ethereum Testnet and running a Hyperdrive UI for users to learn and get educated about how Hyperdrive works, get familiar with the UX of Hyperdrive, and provide feedback on all aspects of the experience.",
      },
      17: {
        targets: [],
        calldatas: [],
        title: "EGP-16: Main Treasury - 4",
        sentenceSummary: "Revised proposal to unwind the main treasury.",
        paragraphSummary:
          "The main treasury  holds approx. 192,000 USDC in assets wound up in Yearn positions. These assets come from affiliate fees via Yearn. A separate proposal manages the unwinding of the GSC treasury, which contains about 60,000 USDC. Following this proposal, two more will be necessary to unwind CRV positions and to consolidate assets into USDC, DAI, and ETH.",
      },
      18: {
        targets: [],
        calldatas: [],
        title: "EGP-31: Foundation Update and ELFI Request",
        paragraphSummary:
          "The main treasury  holds approx. 192,000 USDC in assets wound up in Yearn positions. These assets come from affiliate fees via Yearn. A separate proposal manages the unwinding of the GSC treasury, which contains about 60,000 USDC. Following this proposal, two more will be necessary to unwind CRV positions and to consolidate assets into USDC, DAI, and ETH.",
      },
    },
  },
  gscVoting: {
    name: "GSC",
    address: "0x40309f197e7f94B555904DF0f788a3F48cF326aB",
    descriptionURL: "https://moreinfo.com",
    vault: {
      name: "GSC Vault",
      address: "0xcA870E8aa4FCEa85b5f0c6F4209C8CBA9265B940",
      type: "GSCVault",

      sentenceSummary:
        "The Governance Steering Council (GSC) vault gives one vote to each member that has reached an established threshold of delegated voting power defined by the DAO.",
      paragraphSummary:
        "The Governance Steering Council (GSC) vault gives one vote to each member that has reached an established threshold of delegated voting power defined by the DAO. Council members can create, vote, and execute proposals if the GSC quorum is met, with quorum set by the DAO.",
      descriptionURL:
        "https://docs-delv.gitbook.io/element-developer-docs/governance-council/council-protocol-smart-contracts/voting-vaults/governance-steering-council-gsc-vault",
    },
    proposals: {
      0: {
        descriptionURL:
          "https://docs.google.com/document/d/17tR4ZjibQyfAma3QfklA0FTA4n6S3lGEXXWMzT75K-k/edit",
        targets: [],
        calldatas: [],
        title: "(Invalid) EGP16-1: Unwind GSC Treasury",
        sentenceSummary:
          "This PR follows on from the approved snapshot proposal to unwind the GSC and main treasury, currently living in a gnosis safe, transferring the unwound assets to the main treasury.",
        paragraphSummary:
          "The GSC treasury  is a gnosis safe currently containing 24 different assets in balancer pools. These assets came from protocol fees traded on the Element protocol. In order to unwind the assets, the LP positions are withdrawn from the Balancer pools. After withdrawal, principal tokens are redeemed through the Element protocol. Once redeemed, the base assets are transferred and consolidated to the main treasury.",
      },
      1: {
        descriptionURL:
          "https://docs.google.com/document/d/17tR4ZjibQyfAma3QfklA0FTA4n6S3lGEXXWMzT75K-k/edit",
        targets: [],
        calldatas: [],
        title: "EGP16-1: Unwind GSC Treasury",
        sentenceSummary:
          "This PR follows on from the approved snapshot proposal to unwind the GSC and main treasury, currently living in a gnosis safe, transferring the unwound assets to the main treasury.",
        paragraphSummary:
          "The GSC treasury  is a gnosis safe currently containing 24 different assets in balancer pools. These assets came from protocol fees traded on the Element protocol. In order to unwind the assets, the LP positions are withdrawn from the Balancer pools. After withdrawal, principal tokens are redeemed through the Element protocol. Once redeemed, the base assets are transferred and consolidated to the main treasury.",
      },
      2: {
        descriptionURL:
          "https://docs.google.com/document/d/17tR4ZjibQyfAma3QfklA0FTA4n6S3lGEXXWMzT75K-k/edit",
        targets: [],
        calldatas: [],
        title: "EGP-16: GSC-1",
        sentenceSummary:
          "Revised proposal to unwind the GSC treasury, transferring the unwound assets to the main treasury.",
        paragraphSummary:
          "The GSC treasury is a gnosis safe currently containing 24 different assets in balancer pools. These assets came from protocol fees traded on the Element protocol. In order to unwind the assets, the LP positions are withdrawn from the Balancer pools. After withdrawal, principal tokens are redeemed through the Element protocol. Once redeemed, the base assets are transferred and consolidated to the main treasury.",
      },
      3: {
        descriptionURL:
          "https://docs.google.com/document/d/17tR4ZjibQyfAma3QfklA0FTA4n6S3lGEXXWMzT75K-k/edit",
        targets: [],
        calldatas: [],
        title: "EGP-16: GSC-2",
        sentenceSummary:
          "Revised proposal to unwind the GSC treasury, transferring the unwound assets to the main treasury.",
        paragraphSummary:
          "The GSC treasury is a gnosis safe currently containing 24 different assets in balancer pools. These assets came from protocol fees traded on the Element protocol. In order to unwind the assets, the LP positions are withdrawn from the Balancer pools. After withdrawal, principal tokens are redeemed through the Element protocol. Once redeemed, the base assets are transferred and consolidated to the main treasury.",
      },
      4: {
        descriptionURL:
          "https://docs.google.com/document/d/17tR4ZjibQyfAma3QfklA0FTA4n6S3lGEXXWMzT75K-k/edit",
        targets: [],
        calldatas: [],
        title: "EGP-16: GSC-3",
        sentenceSummary:
          "Revised proposal to unwind the GSC treasury, transferring the unwound assets to the main treasury.",
        paragraphSummary:
          "The GSC treasury is a gnosis safe currently containing 24 different assets in balancer pools. These assets came from protocol fees traded on the Element protocol. In order to unwind the assets, the LP positions are withdrawn from the Balancer pools. After withdrawal, principal tokens are redeemed through the Element protocol. Once redeemed, the base assets are transferred and consolidated to the main treasury.",
      },
      5: {
        descriptionURL:
          "https://docs.google.com/document/d/17tR4ZjibQyfAma3QfklA0FTA4n6S3lGEXXWMzT75K-k/edit",
        targets: [],
        calldatas: [],
        title: "EGP-16: GSC-4",
        sentenceSummary:
          "Revised proposal to unwind the GSC treasury, transferring the unwound assets to the main treasury.",
        paragraphSummary:
          "The GSC treasury is a gnosis safe currently containing 24 different assets in balancer pools. These assets came from protocol fees traded on the Element protocol. In order to unwind the assets, the LP positions are withdrawn from the Balancer pools. After withdrawal, principal tokens are redeemed through the Element protocol. Once redeemed, the base assets are transferred and consolidated to the main treasury.",
      },
      6: {
        descriptionURL:
          "https://docs.google.com/document/d/17tR4ZjibQyfAma3QfklA0FTA4n6S3lGEXXWMzT75K-k/edit",
        targets: [],
        calldatas: [],
        title: "EGP-16: GSC-5",
        sentenceSummary:
          "Revised proposal to unwind the GSC treasury, transferring the unwound assets to the main treasury.",
        paragraphSummary:
          "This proposal is being submitted by the HyperVue Foundation (Formerly Element Foundation), a Cayman Islands entity created alongside the launch of the Element DAO in 2021 to aid and support the decisions proposed and made by stakeholders and owners of the Element protocol (ELFI holders & community members). \n\n As we begin a new chapter in line with the mainnet deployment of the Hyperdrive, the next version of the Element Protocol, the Foundation gears towards assisting the DAO and protocol to reach their full potential.",
      },
    },
  },

  /**
   * Optional Push integration
   */
  push: {
    channel: "0x349da2A6825284E9E181D46D664b95aecE86da56",
    env: "prod",
  },
};
