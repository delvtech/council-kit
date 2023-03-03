import { CouncilContext, VoteResults, VotingContract } from "@council/sdk";
import { getElementAddress } from "src/addresses/elementAddresses";
import { provider } from "src/provider";

// wrap the script in an async function so we can await promises
export async function getProposalResults(): Promise<void> {
  const addresses = await getElementAddress();

  // create a CouncilContext instance
  const context = new CouncilContext(provider);

  // Create a VotingContract instance.
  // The vaults array can be left empty since we won't be fetching any voting
  // power data.
  const coreVoting = new VotingContract(addresses.coreVoting, [], context);

  // get all proposals
  const proposals = await coreVoting.getProposals();

  // get results for all proposals and key them by id in a new object
  const resultsByProposalId: Record<number, VoteResults> = {};
  for (const proposal of proposals) {
    resultsByProposalId[proposal.id] = await proposal.getResults();
  }

  console.table(resultsByProposalId);

  process.exit();
}

getProposalResults();
