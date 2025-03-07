import { ReadWriteCouncil } from "@delvtech/council-js";
import { council, publicClient, walletClient } from "src/client";
import type { Address } from "viem";

const DAY_SECONDS = 24n * 60n * 60n;
const DAY_BLOCKS = DAY_SECONDS / 12n; // Assuming 12s block time

if (!(council instanceof ReadWriteCouncil)) {
  throw new Error("Missing WALLET_PRIVATE_KEY environment variable.");
}

const coreVoting = council.coreVoting("0x"); // <-- replace address
const walletAddress = walletClient?.account?.address;

if (!walletAddress) {
  throw Error("Missing private key");
}

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
  coreVoting.contract.encodeFunctionData("setDefaultQuorum", { quorum: 100n }),
];

const currentBlock = await publicClient.getBlockNumber();

const hash = await coreVoting.createProposal({
  args: {
    targets,
    calldatas,
    votingVaults,

    // the ballot to cast for the first vote
    ballot: "yes",

    // the block number after which the proposal can no longer be executed
    lastCallBlock: currentBlock + 14n * DAY_BLOCKS,
  },
  options: {
    onMined: (receipt) => {
      console.log("Transaction receipt:", receipt);
    },
  },
});

console.log("Transaction submitted:", hash);

process.exit();
