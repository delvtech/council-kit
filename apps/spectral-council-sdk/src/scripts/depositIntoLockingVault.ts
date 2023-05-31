import { CouncilContext, LockingVault } from "@council/sdk";
import { Wallet } from "ethers";
import { getSpectralAddress } from "src/addresses/spectralAddresses";
import { provider } from "src/provider";

// wrap the script in an async function so we can await promises
export async function depositIntoLockingVault(): Promise<void> {
  const addresses = await getSpectralAddress();

  // create a CouncilContext instance
  const context = new CouncilContext(provider);

  // create model instances
  const lockingVault = new LockingVault(addresses.lockingVault, context);

  // create a signer for the proposal transaction
  const signer = new Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);
  const publicAddress = await signer.getAddress();

  // deposit tokens into LockingVault
  await lockingVault.deposit(signer, publicAddress, "333", publicAddress);

  // trying to create a proposal with vaults you have no power in will throw an
  // uninitialized error.
  const lockingVaultVotingPower = await lockingVault.getVotingPower(
    signer.address,
  );

  console.log(
    `Address ${publicAddress} has ${lockingVaultVotingPower} voting power in locked voting contract`,
  );

  process.exit();
}

depositIntoLockingVault();
