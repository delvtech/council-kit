import { QueryClient } from "@tanstack/query-core";
import { getDefaultProvider } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CoreVotingQueries } from "src";
import addressList from "./ElementMainnetAddressList.json";

const defaultChainId = 5;
const provider = getDefaultProvider(process.env.PROVIDER_URI || defaultChainId);

export async function main(): Promise<void> {
  // create a queryClient
  const queryClient = new QueryClient();

  // Create the coreVotingQueries singleton, or import it from a setup file
  const { addresses } = addressList;
  const coreVotingQueries = new CoreVotingQueries(
    addresses.coreVoting,
    [addresses.lockingVault, addresses.vestingVault],
    queryClient,
    provider,
  );

  const gregsVotingPower = await coreVotingQueries
    .getTotalVotingPowerForAddress("0x7AE8b0D6353F0931EB9FaC0A3562fA9e4C6Ff933")
    .fetch();
  console.log("Greg's total voting power:", formatEther(gregsVotingPower));

  const proposalCount = await coreVotingQueries.getProposalCount().fetch();
  console.log("Proposal count", proposalCount);

  console.log(
    "Executed proposals",
    (await coreVotingQueries.getProposalExecutedEvents().fetch()).map((event) =>
      event.args.proposalId.toNumber(),
    ),
  );

  console.log(
    "Executed proposal #1",
    await coreVotingQueries.getProposalQuorum(1).fetch(),
  );
}

main();
