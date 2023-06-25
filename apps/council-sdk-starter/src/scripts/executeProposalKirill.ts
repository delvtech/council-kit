import { CouncilContext, VotingContract } from "@council/sdk";
import { Wallet } from "ethers";
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

  // create a signer for the proposal transaction
  const signer = new Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

  // get the proposal to be executed
  const proposal = await coreVoting.getProposal(0);

  const tx = await proposal.execute(signer, {
    onSubmitted: (tx) => console.log(`Executing... (${tx})`),
  });

  console.log(`Executed! (${tx})`);

  process.exit();
}

getProposalResults();
