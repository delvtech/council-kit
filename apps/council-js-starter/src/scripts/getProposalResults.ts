import { ReadWriteCouncil, VoteResults } from "@delvtech/council-viem";
import { publicClient, walletClient } from "src/client";

// wrap the script in an async function so we can await promises
export async function getProposalResults(): Promise<void> {
  if (!walletClient) {
    throw new Error(
      "Wallet client not available. Ensure the WALLET_PRIVATE_KEY environment variable is set.",
    );
  }

  // create a ReadWriteCouncil instance
  const council = new ReadWriteCouncil({ publicClient, walletClient });

  // Create a ReadWriteCoreVoting instance.
  const coreVoting = council.coreVoting({
    address: "0x", // <-- replace with the CoreVoting contract address
  });

  // get all proposals
  const proposals = await coreVoting.getProposals();

  // get results for all proposals and key them by id in a new object
  const resultsByProposalId: Record<number, VoteResults> = {};
  for (const proposal of proposals) {
    resultsByProposalId[Number(proposal.id)] = await proposal.getResults();
  }

  console.table(resultsByProposalId);

  process.exit();
}

getProposalResults();
