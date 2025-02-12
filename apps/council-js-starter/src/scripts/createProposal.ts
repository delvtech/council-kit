import { ReadWriteCouncil } from "@delvtech/council-viem";
import { publicClient, walletClient } from "src/client";

// approx 90 days in blocks assuming 12 seconds a block
const FOURTEEN_DAYS_IN_BLOCKS = (14n * 24n * 60n * 60n) / 12n;

// wrap the script in an async function so we can await promises
export async function createProposal(): Promise<void> {
  if (!walletClient) {
    throw new Error(
      "Wallet client not available. Ensure the WALLET_PRIVATE_KEY environment variable is set.",
    );
  }

  // create a ReadWriteCouncil instance
  const council = new ReadWriteCouncil({ publicClient, walletClient });

  // create model instances
  const lockingVault = council.lockingVault("0x"); // <-- replace with the LockingVault contract address
  const vestingVault = council.vestingVault("0x"); // <-- replace with the VestingVault contract address
  const coreVoting = council.coreVoting({
    address: "0x", // <-- replace with the CoreVoting contract address
    vaults: [lockingVault, vestingVault],
  });

  // prep arguments

  // the vaults that will be used to cast the first vote
  const vaults = [];
  const account = (await walletClient.getAddresses())[0];

  // trying to create a proposal with vaults you have no power in will throw an
  // uninitialized error.
  const lockingVaultVotingPower = await lockingVault.getVotingPower({
    account,
  });
  if (lockingVaultVotingPower > 0n) {
    vaults.push(lockingVault);
  }
  const vestingVaultVotingPower = await vestingVault.getVotingPower({
    account,
  });
  if (vestingVaultVotingPower > 0) {
    vaults.push(vestingVault);
  }

  // the target contract addresses for the proposal
  const targets = [coreVoting.address];

  // the proposed calls datas to send to the targets
  const calldatas = [
    coreVoting.contract.encodeFunctionData("setDefaultQuorum", {
      quorum: 100n,
    }),
  ];

  const currentBlock = await publicClient.getBlockNumber();

  // the block number after which the proposal can no longer be executed
  const lastCall = currentBlock + FOURTEEN_DAYS_IN_BLOCKS;

  // the ballot to cast for the first vote
  const ballot = "yes";

  const hash = await coreVoting.createProposal({
    ballot,
    calldatas,
    lastCall,
    targets,
    vaults,
  });

  console.log(hash);

  process.exit();
}

createProposal();
