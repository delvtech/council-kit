import { VotingContract } from "src/models/VotingContract/VotingContract";
import { CouncilContext } from "src/context";
import ElementGoerliAddressList from "./ElementGoerliAddressList.json";
import { GSCVotingContract } from "src/models/VotingContract/GSCVotingContract";
import { parseUnits } from "ethers/lib/utils";
import { getDefaultProvider } from "ethers";

const chainId = 5;
const provider = getDefaultProvider(process.env.PROVIDER_URI || chainId);

export async function main(): Promise<void> {
  const { addresses } = ElementGoerliAddressList;
  const connectedWallet = "0x00860d89A40a5B4835a3d498fC1052De04996de6";

  // create a context instance for the models to share
  const context = new CouncilContext({ chainId, provider });

  // create a new VotingContract instance for general voting
  const coreVoting = new VotingContract(
    addresses.coreVoting,
    [addresses.lockingVault, addresses.vestingVault],
    context,
  );

  // create a new GSCVotingContract instance for GSC voting
  const gscVoting = new GSCVotingContract(
    addresses.gscVoting,
    addresses.gscVault,
    context,
  );

  // get all proposals
  console.log("All Proposals");

  const coreProposals = await coreVoting.getProposals();
  const gscProposals = await gscVoting.getProposals();
  const allProposals = [...coreProposals, ...gscProposals];

  console.table(
    await Promise.all(
      allProposals.map(async (proposal) => ({
        voting_contract: proposal.votingContract.name,
        id: proposal.id,
        created: await (await proposal.getCreatedDate()).toLocaleDateString(),
        voting_ends: new Date(
          Date.now() +
            ((await proposal.getExpirationBlock()) -
              (await proposal.getCreatedBlock())) *
              12000, // 12 seconds a block
        ).toLocaleDateString(),
        quorum: `${
          +(await proposal.getQuorum()) * (await proposal.getQuorumRatio())
        } / ${await proposal.getQuorum()}`,
        your_ballot: (await proposal.getVote(connectedWallet)).ballot,
      })),
    ),
  );

  // get proposal details
  console.log("Proposal Details");

  const proposal = coreVoting.getProposal(0);

  console.table({
    core_voting_proposal_0: {
      id: proposal.id,
      name: proposal.name,
      quorum: `${
        +(await proposal.getQuorum()) * (await proposal.getQuorumRatio())
      } / ${await proposal.getQuorum()}`,
      voting_contract:
        proposal.votingContract.address === addresses.coreVoting
          ? "Core Voting"
          : "GSC Voting",
      created: await (await proposal.getCreatedDate()).toLocaleDateString(),
      voting_ends: new Date(
        Date.now() +
          ((await proposal.getExpirationBlock()) -
            (await proposal.getCreatedBlock())) *
            12000, // 12 seconds a block
      ).toLocaleDateString(),
      executable_on: new Date(
        Date.now() +
          ((await proposal.getUnlockBlock()) -
            (await proposal.getCreatedBlock())) *
            12000, // 12 seconds a block
      ).toLocaleDateString(),
      last_call_for_execution: new Date(
        Date.now() +
          ((await proposal.getLastCallBlock()) -
            (await proposal.getCreatedBlock())) *
            12000, // 12 seconds a block
      ).toLocaleDateString(),
      your_voting_power: await proposal.getVotingPower(connectedWallet),
      cast_ballot: (await proposal.getVote(connectedWallet)).ballot,
    },
  });

  // get proposal voting activity
  console.log("Proposal Voting Activity");
  console.table(
    (await proposal.getVotes()).map((vote) => ({
      voting_power: vote.power,
      ballot: vote.power,
    })),
  );

  // get all vaults
  console.log("All Vaults");

  const vaults = [...coreVoting.vaults, ...gscVoting.vaults];

  console.table(
    await Promise.all(
      vaults.map(async (vault) => ({
        address: vault.address,
        name: vault.name,
        total_voting_power: await vault.getTotalVotingPower(),
        your_voting_power: await vault.getVotingPower(connectedWallet),
      })),
    ),
  );

  // get vault details
  console.log("Vault Details");

  const vault = coreVoting.vaults[0];

  console.table({
    core_voting_vault_0: {
      address: vault.address,
      name: vault.name,
      your_voting_power: await vault.getVotingPower(connectedWallet),
      percent_of_vault_tvp:
        (+(await vault.getVotingPower(connectedWallet)) /
          +(await vault.getTotalVotingPower())) *
        100,
      delegated_to_you: (await vault.getDelegatorsTo(connectedWallet)).length,
      participants: (await vault.getVoters()).length,
    },
  });

  // get all voters
  console.log("All Voters");

  const coreVoters = await coreVoting.getVoters();
  const gscVoters = await gscVoting.getVoters();
  const allVoters = Array.from(new Set([...coreVoters, ...gscVoters]));

  console.table(
    await Promise.all(
      allVoters.map(async (voter) => {
        return {
          address: voter.address,
          ens: await voter.getEnsName(),
          GSCStatus: await (async () => {
            if (await gscVoting.getIsIdle(voter.address)) {
              return "idle member";
            }
            if (await gscVoting.getIsMember(voter.address)) {
              return "member";
            }
            if (
              parseUnits(await coreVoting.getVotingPower(voter.address)).gt(
                parseUnits(await gscVoting.getRequiredVotingPower()),
              )
            ) {
              return "eligible";
            }
            return "ineligible";
          })(),
          voting_power: await coreVoting.getVotingPower(voter.address),
          percent_of_tvp:
            (+(await coreVoting.getVotingPower(voter.address)) /
              +(await coreVoting.getTotalVotingPower())) *
            100,
          participation_grade: await (async () => {
            const [votesCount, votingOpportunitiesCount] =
              await coreVoting.getParticipation(addresses.coreVoting);
            const [GSCVotesCount, gscVotingOpportunitiesCount] =
              await gscVoting.getParticipation(addresses.coreVoting);
            return (
              ((votesCount + GSCVotesCount) /
                (votingOpportunitiesCount + gscVotingOpportunitiesCount)) *
              100
            );
          })(),
        };
      }),
    ),
  );

  // get voter details
  console.log("Voter Details");

  const voter = allVoters[0];

  console.table({
    voter_0: {
      address: voter.address,
      ens: await voter.getEnsName(),
      voting_power: await coreVoting.getVotingPower(voter.address),
      percent_of_tvp:
        (+(await coreVoting.getVotingPower(voter.address)) /
          +(await coreVoting.getTotalVotingPower())) *
        100,
      GSCStatus: await (async () => {
        if (await gscVoting.getIsIdle(voter.address)) {
          return "idle member";
        }
        if (await gscVoting.getIsMember(voter.address)) {
          return "member";
        }
        if (
          parseUnits(await coreVoting.getVotingPower(voter.address)).gt(
            parseUnits(await gscVoting.getRequiredVotingPower()),
          )
        ) {
          return "eligible";
        }
        return "ineligible";
      })(),
      proposals_voted:
        (await voter.getVotes(addresses.coreVoting)).length +
        (await voter.getVotes(addresses.gscVoting)).length,
      proposals_created: "TODO",
      participation_grade: await (async () => {
        const [votesCount, votingOpportunitiesCount] =
          await coreVoting.getParticipation(addresses.coreVoting);
        const [GSCVotesCount, gscVotingOpportunitiesCount] =
          await gscVoting.getParticipation(addresses.coreVoting);
        return (
          ((votesCount + GSCVotesCount) /
            (votingOpportunitiesCount + gscVotingOpportunitiesCount)) *
          100
        );
      })(),
    },
  });

  // get voter voting history
  console.log("Voter Voting History");
  const coreVotes = await voter.getVotes(addresses.coreVoting);
  const gscVotes = await voter.getVotes(addresses.gscVoting);
  const allVotes = [...coreVotes, ...gscVotes];
  console.table(
    await Promise.all(
      allVotes.map(async (vote) => ({
        proposal: `${vote.proposal.votingContract.name} - ${vote.proposal.name}`,
        vote_outcome: Object.entries(await vote.proposal.getResults())
          .map((ballotCount) => ballotCount.join(": "))
          .join(" | "),
        vote: vote.ballot,
        voting_power: vote.power,
      })),
    ),
  );

  // get voter vault info
  // const voterVaults =
}

main();
