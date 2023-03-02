import addressList from "src/addresses/ElementMainnetAddressList.json";
import { getDefaultProvider, Wallet, ethers, BigNumber } from "ethers";
import {
  CouncilContext,
  GSCVault,
  GSCVotingContract,
  LockingVault,
  VestingVault,
  VotingContract,
} from "@council/sdk";
import { CoreVoting__factory } from "@council/typechain";

const defaultChainId = 5; // Goerli chain id

// get provider using the PROVIDER_URI environment variable. Fallback to a
// default Goerli provider if no environment variable is found.
const provider = getDefaultProvider(process.env.PROVIDER_URI || defaultChainId);

// Wrap the script in an async function so we can await promises.
export async function main(): Promise<void> {
  // get addresses from the imported address list
  const { addresses } = addressList;

  // create a context instance for the models to share
  const context = new CouncilContext(provider);

  // create vault instances
  const lockingVault = new LockingVault(addresses.lockingVault, context);
  const vestingVault = new VestingVault(addresses.vestingVault, context);
  const gscVault = new GSCVault(addresses.gscVault, context);

  // create a new VotingContract instance for general voting
  const coreVoting = new VotingContract(
    addresses.coreVoting,
    [lockingVault, vestingVault],
    context,
  );

  // create a new GSCVotingContract instance for GSC voting
  const gscVoting = new GSCVotingContract(
    addresses.gscCoreVoting,
    gscVault,
    context,
  );

  // get all core voting proposals
  const coreProposals = await coreVoting.getProposals();
  console.log("proposals", coreProposals.length);

  // for each proposal, get the results
  for (const proposal of coreProposals) {
    console.log(`${proposal.name} results:`, await proposal.getResults());
  }

  // get all GSC members
  const gscMembers = await gscVoting.getVoters();
  console.log("gscMembers", gscMembers.length);

  // for each GSC member, get their core voting power.
  for (const member of gscMembers) {
    console.log(
      `GSC Member, ${member.address}'s voting power:`,
      await coreVoting.getVotingPower(member.address),
    );
  }

  // // get a signer for transactions using the WALLET_PRIVATE_KEY environment
  // // variable
  // const signer = new Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

  // // prep arguments to create a new proposal:

  // // the vaults argument is used to submit the first vote on the proposal
  // const vaults = coreVoting.vaults.map(({ address }) => address);

  // // set the target argument to the core voting contract
  // const targets = [coreVoting.address];

  // // get the core voting contract abi to encode function data
  // const coreVotingInterface = new ethers.utils.Interface(
  //   CoreVoting__factory.abi,
  // );

  // // set the calldatas argument to an encoded method call on the core voting
  // // contract which will set the default quorum to 10.
  // const calldatas = [
  //   coreVotingInterface.encodeFunctionData("setDefaultQuorum", [
  //     BigNumber.from(10),
  //   ]),
  // ];

  // const currentBlock = await provider.getBlockNumber();

  // // set lastCall to the approx 30 days from the current block (assuming an
  // // average block time of 12 seconds)
  // const lastCall = currentBlock + (30 * 24 * 60 * 60) / 12;

  // // create the proposal
  // const tx = await coreVoting.createProposal(
  //   signer,
  //   vaults,
  //   targets,
  //   calldatas,
  //   lastCall,
  //   "yes",
  // );
  // console.log(tx);

  process.exit();
}

main();
