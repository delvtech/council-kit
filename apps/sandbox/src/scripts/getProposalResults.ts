import { fixed } from "@delvtech/fixed-point-wasm";
import { council } from "src/client";

const coreVoting = council.coreVoting("0x"); // <-- replace address

// get all proposals
const proposals = await coreVoting.getProposalCreations();

// get results for all proposals and key them by id in a new object
const resultsByProposalId: {
  [proposalId: number]: {
    yes: string;
    no: string;
    maybe: string;
    total: string;
  };
} = {};

await Promise.all(
  proposals.map(async ({ proposalId }) => {
    const results = await coreVoting.getProposalVotingPower(proposalId);

    resultsByProposalId[Number(proposalId)] = {
      yes: fixed(results.yes).format(),
      no: fixed(results.no).format(),
      maybe: fixed(results.maybe).format(),
      total: fixed(results.total).format(),
    };
  }),
);

console.table(resultsByProposalId);

process.exit();
