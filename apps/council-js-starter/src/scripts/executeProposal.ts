import { ReadWriteCouncil } from "@delvtech/council-js";
import { council, publicClient } from "src/client";

if (!(council instanceof ReadWriteCouncil)) {
  throw new Error("Missing WALLET_PRIVATE_KEY environment variable.");
}

const coreVoting = council.coreVoting("0x"); // <-- replace with the CoreVoting contract address

// get the proposal to be executed
const hash = await coreVoting.executeProposal({
  args: {
    proposalId: 0n, // <-- replace with the proposal ID
    targets: ["0x"], // <-- replace with the contract addresses
    calldatas: ["0x"], // <-- replace with the execution calldata
  },
});
console.log("Transaction submitted:", hash);

const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("Transaction receipt:", receipt);

process.exit();
