import { ReadWriteCouncil } from "@delvtech/council-js";
import { council, drift } from "src/client";

if (!(council instanceof ReadWriteCouncil)) {
  throw new Error("Missing WALLET_PRIVATE_KEY environment variable.");
}

const DAY_IN_BLOCKS = 6496n;
const lockDuration = DAY_IN_BLOCKS * 3n;
const extraVoteTime = DAY_IN_BLOCKS * 5n;

const coreVoting = council.coreVoting(
  "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853",
);

const callData = coreVoting.contract.encodeFunctionData("changeVaultStatus", {
  vault: "0x0dcd1bf9a1b36ce34237eeafef220932846bcd82",
  isValid: true,
});

const currentBlock = await drift.getBlockNumber();
console.log(
  "Current block:",
  currentBlock + lockDuration + extraVoteTime + 10n,
);

const hash = await coreVoting.createProposal({
  args: {
    targets: [coreVoting.contract.address],
    votingVaults: ["0x8a791620dd6260079bf849dc5567adc3f2fdc318"],
    calldatas: [callData],
    ballot: "yes",
    lastCallBlock: currentBlock + lockDuration + extraVoteTime + 10n,
  },
  options: {
    onMined: (receipt) => {
      console.log("Transaction receipt:", receipt);
    },
  },
});

// const hash = await coreVoting.executeProposal({
//   args: {
//     proposalId: 0n,
//     calldatas: [callData],
//     targets: [coreVoting.contract.address],
//   },
//   options: {
//     onMined: (receipt) => {
//       console.log("Transaction receipt:", receipt);
//     },
//   },
// });

console.log("Transaction submitted:", hash);
