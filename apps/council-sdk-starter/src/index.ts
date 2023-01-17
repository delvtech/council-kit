import addressList from "src/addresses/ElementMainnetAddressList.json";
import { getDefaultProvider, Wallet } from "ethers";
import {
  CouncilContext,
  GSCVault,
  GSCVotingContract,
  LockingVault,
  VestingVault,
  VotingContract,
} from "@council/sdk";

const defaultChainId = 5;
const provider = getDefaultProvider(process.env.PROVIDER_URI || defaultChainId);

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
    addresses.gscCoreVoting,
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

  // // submit transactions
  // const signer = new Wallet(
  //   process.env.EXAMPLE_WALLET_PRIVATE_KEY as string,
  //   provider,
  // );
  // await lockingVault
  //   .changeDelegate(signer, signer.address, {
  //     onSubmitted: (hash) => {
  //       console.log("transaction submitted", hash);
  //     },
  //   })
  //   .then(() => {
  //     console.log("Success!");
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
}

main();
