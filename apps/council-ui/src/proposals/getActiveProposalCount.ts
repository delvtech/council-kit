import { VotingContract } from "@council/sdk";

export async function getActiveProposalCount(
  votingContract: VotingContract,
): Promise<number> {
  let activeProposalCount = 0;
  const proposals = (await votingContract.getProposals()) || [];
  for (const proposal of proposals) {
    if (await proposal.getIsActive()) {
      activeProposalCount++;
    }
  }
  return activeProposalCount;
}
