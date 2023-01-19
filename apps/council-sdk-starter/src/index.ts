import addressList from "src/addresses/ElementGoerliAddressList.json";
import { getDefaultProvider, Wallet, utils, BigNumber } from "ethers";
import {
  CouncilContext,
  GSCVault,
  GSCVotingContract,
  LockingVault,
  VestingVault,
  VotingContract,
  Ballot,
} from "@council/sdk";
import { CoreVoting__factory } from "@council/typechain";

const defaultChainId = 5;
const provider = getDefaultProvider(process.env.PROVIDER_URI || defaultChainId);
// console.log(provider);

export async function main(): Promise<void> {
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
    addresses.gscVoting,
    gscVault,
    context,
  );

  // get some data
  const coreProposals = await coreVoting.getProposals();
  for (const proposal of coreProposals) {
    console.log(`${proposal.name} results:`, await proposal.getResults());
  }

  const gscMembers = await gscVoting.getVoters();
  for (const member of gscMembers) {
    console.log(
      `GSC Member, ${member.address}'s voting power:`,
      await coreVoting.getVotingPower(member.address),
    );
  }

  // submit transactions
  const signer = new Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

  const vaults = [lockingVault.address];
  const targets = [coreVoting.address];
  const coreVotingInterface = new utils.Interface(CoreVoting__factory.abi);
  const calldatas = [
    coreVotingInterface.encodeFunctionData("setDefaultQuorum", [
      BigNumber.from(10),
    ]),
  ];

  const currentBlock = await provider.getBlockNumber();
  const lockDuration = 6496 * 3;
  console.log(vaults, targets, calldatas, currentBlock + lockDuration + 300001);

  const tx = await coreVoting.createProposal(
    signer,
    vaults,
    targets,
    calldatas,
    currentBlock + lockDuration + 300001,
    "yes",
  );

  console.log(tx);
}

main();
