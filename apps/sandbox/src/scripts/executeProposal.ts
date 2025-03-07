import { ReadWriteCouncil } from "@delvtech/council-js";
import { council } from "src/client";

if (!(council instanceof ReadWriteCouncil)) {
  throw new Error("Missing WALLET_PRIVATE_KEY environment variable.");
}

const coreVoting = council.coreVoting("0x"); // <-- replace with the CoreVoting contract address

// get the proposal to be executed
const hash = await coreVoting.executeProposal({
  args: {
    proposalId: 0n, // <-- replace with the proposal ID

    // These will be fetched from the creation transaction if not provided.
    // targets: ["0x"], // <-- replace with the contract addresses (optional)
    // calldatas: ["0x"], // <-- replace with the execution calldata (optional)
  },
  options: {
    onMined: (receipt) => {
      console.log("Transaction receipt:", receipt);
    },
  },
});
console.log("Transaction submitted:", hash);

process.exit();
