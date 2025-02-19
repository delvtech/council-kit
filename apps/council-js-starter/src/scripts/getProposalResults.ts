import type { VoteResults } from "@delvtech/council-js";
import { council } from "src/client";

const coreVoting = council.coreVoting("0x"); // <-- replace address

// get all proposals
const proposals = await coreVoting.getProposals();

// get results for all proposals and key them by id in a new object
const resultsByProposalId: Record<number, VoteResults> = {};
for (const { proposalId } of proposals) {
  resultsByProposalId[Number(proposalId)] =
    await coreVoting.getProposalResults(proposalId);
}

console.table(resultsByProposalId);

process.exit();
