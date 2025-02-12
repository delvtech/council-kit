import { ReadWriteCouncil } from "@delvtech/council-js";
import { council, publicClient } from "src/client";
import type { Address } from "viem";

// approx 90 days in blocks assuming 12 seconds a block
const FOURTEEN_DAYS_IN_BLOCKS = (14n * 24n * 60n * 60n) / 12n;

if (!(council instanceof ReadWriteCouncil)) {
  throw new Error("Missing WALLET_PRIVATE_KEY environment variable.");
}

const coreVoting = council.coreVoting("0x"); // <-- replace address
const walletAddress = await coreVoting.contract.getSignerAddress();

// the vaults from which power will be drawn for the initial ballot
let votingVaults: Address[] = ["0x", "0x"]; // <-- replace addresses

// Trying to create a proposal with vaults you have no power in will throw an
// uninitialized error.
const vaultPowers = await Promise.all(
  votingVaults.map((vault) =>
    council.votingVault(vault).getVotingPower({ voter: walletAddress }),
  ),
);
votingVaults = votingVaults.filter((_, i) => vaultPowers[i] > 0n);

// The contracts to call in the proposal
const targets = [coreVoting.address];

// The data to send in the contract calls
const calldatas = [
  coreVoting.contract.encodeFunctionData("setDefaultQuorum", {
    quorum: 100n,
  }),
];

const currentBlock = await publicClient.getBlockNumber();

// the block number after which the proposal can no longer be executed
const lastCallBlock = currentBlock + FOURTEEN_DAYS_IN_BLOCKS;

// the ballot to cast for the first vote
const ballot = "yes";

const hash = await coreVoting.createProposal({
  args: { ballot, calldatas, lastCallBlock, targets, votingVaults },
});

console.log("Transaction submitted:", hash);

const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("Transaction receipt:", receipt);

process.exit();
