import { CouncilContext, VotingContract } from "@council/sdk";
import { Wallet } from "ethers";
import { getElementAddress } from "src/addresses/elementAddresses";
import { provider } from "src/provider";

// wrap the script in an async function so we can await promises
export async function changeVaultStatus(): Promise<void> {
  const addresses = await getElementAddress();

  // create a CouncilContext instance
  const context = new CouncilContext(provider);

  // Create a VotingContract instance.
  // The vaults array can be left empty since we won't be fetching any voting
  // power data.
  // const coreVoting = new VotingContract(addresses.coreVoting, [], context);
  const coreVoting = new VotingContract(
    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
    [],
    context,
  );

  // create a signer for the proposal transaction
  const signer = new Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

  const tx = await coreVoting.changeVaultStatus(
    signer,
    "0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0",
    true,
  );

  console.log(`Executed! (${tx})`);

  process.exit();
}

changeVaultStatus();
