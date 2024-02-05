import {
  CouncilContext,
  LockingVault,
  VestingVault,
  VotingContract,
} from "@council/sdk";
import { CoreVoting__factory } from "@council/typechain";
import { BigNumber, utils, Wallet } from "ethers";
import { getElementAddress } from "src/addresses/elementAddresses";
import { provider } from "src/provider";

// approx 90 days in blocks assuming 12 seconds a block
const NINETY_DAYS_IN_BLOCKS = (90 * 24 * 60 * 60) / 12;

// wrap the script in an async function so we can await promises
export async function createProposal(): Promise<void> {
  const addresses = await getElementAddress();

  // create a CouncilContext instance
  const context = new CouncilContext(provider);

  // create model instances
  const lockingVault = new LockingVault(addresses.lockingVault, context);
  const vestingVault = new VestingVault(addresses.vestingVault, context);
  const coreVoting = new VotingContract(
    addresses.coreVoting,
    [lockingVault, vestingVault],
    context,
  );

  // create a signer for the proposal transaction
  const signer = new Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

  // prep arguments

  // the vaults that will be used to cast the first vote
  const vaults = [];

  // trying to create a proposal with vaults you have no power in will throw an
  // uninitialized error.
  const lockingVaultVotingPower = await lockingVault.getVotingPower(
    signer.address,
  );
  if (+lockingVaultVotingPower > 0) {
    vaults.push(lockingVault);
  }
  const vestingVaultVotingPower = await vestingVault.getVotingPower(
    signer.address,
  );
  if (+vestingVaultVotingPower > 0) {
    vaults.push(vestingVault);
  }

  // the target contract addresses for the proposal
  const targets = [coreVoting.address];

  // get the core voting contract abi to encode call data
  const coreVotingInterface = new utils.Interface(CoreVoting__factory.abi);

  // the proposed calls datas to send to the targets
  const calldatas = [
    coreVotingInterface.encodeFunctionData("setDefaultQuorum", [
      BigNumber.from(10),
    ]),
  ];

  const currentBlock = await provider.getBlockNumber();

  // the block number after which the proposal can no longer be executed
  const lastCall = currentBlock + NINETY_DAYS_IN_BLOCKS;

  // the ballot to cast for the first vote
  const ballot = "yes";

  const tx = await coreVoting.createProposal(
    signer,
    vaults,
    targets,
    calldatas,
    lastCall,
    ballot,
  );

  console.log(tx);

  process.exit();
}

createProposal();
